const bodyParser = require('body-parser');
const crypto = require('crypto');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const syncMemberRoles = require('@/utils/syncMemberRoles');

module.exports = {
  post: [
    bodyParser.json(),
    async (request, response) => {
      const signature = request.headers['x-hub-signature-256'];
      if (!signature) return response.sendError('No signature provided', 400);

      const hmac = crypto.createHmac('sha256', process.env.GITHUB_AUTO_SYNC_TRANSLATORS_SECRET);
      hmac.update(JSON.stringify(request.body));

      const digest = Buffer.from('sha256=' + hmac.digest('hex'), 'utf8');
      const hash = Buffer.from(signature, 'utf8');

      try {
        if (hash.length !== digest.length || !crypto.timingSafeEqual(digest, hash)) return response.sendError('Invalid signature', 403);
      } catch (error) {
        return response.sendError('Invalid signature', 403);
      }

      if (request.body.ref !== 'refs/heads/main') return response.sendError('Not the main branch', 400);

      if (!request.body.commits.some(commit => commit.modified.includes('client/locales/translators.json'))) return response.sendError('No changes to translators.json', 400);

      try {
        await exec('git pull');

        await response.sendStatus(201);

        return syncMemberRoles();
      } catch (error) {
        logger.error('Error while pulling from GitHub:', error);
        response.sendError(`Error while pulling from GitHub:\n${error}`, 500);
      }
    }
  ]
};
