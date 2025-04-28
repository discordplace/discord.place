const crypto = require('crypto');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const syncMemberRoles = require('@/utils/syncMemberRoles');
const validateRequest = require('@/utils/middlewares/validateRequest');

module.exports = {
  post: [
    validateRequest,
    async (request, response) => {
      const secret = process.env.GITHUB_AUTO_SYNC_TRANSLATORS_SECRET;

      const signature = request.headers['x-hub-signature-256'];
      if (!signature) return response.sendError('Signature not found.', 400);

      const hmac = crypto.createHmac('sha256', secret);
      hmac.update(request.body);
      const calculatedSignature = hmac.digest('hex');

      if (calculatedSignature !== signature) return response.sendError('Invalid signature.', 401);

      await response.send('OK');

      const body = JSON.parse(request.body.toString('utf-8'));

      if (body.ref !== 'refs/heads/main') return response.sendError('Not the main branch', 400);

      if (!body.commits.some(commit => commit.modified.includes('translators.json'))) return response.sendError('No changes to translators.json', 400);

      try {
        await exec('git pull');

        await response.status(201).end();

        return syncMemberRoles();
      } catch (error) {
        logger.error('Error while pulling from GitHub:', error);
        response.sendError(`Error while pulling from GitHub:\n${error}`, 500);
      }
    }
  ]
};
