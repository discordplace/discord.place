const crypto = require('crypto');
const { cookie, matchedData, query, validationResult } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const getAccessToken = require('@/utils/getAccessToken');
const authCallback = require('@/utils/authCallback');
const sanitizeHtml = require('sanitize-html');
const User = require('@/schemas/User');
const checkAuthentication = require('@/utils/middlewares/checkAuthentication');

const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
const frontendOrigin = config.frontendUrl || 'http://localhost:5000';

module.exports = {
  get: [
    query('code')
      .optional()
      .isString().withMessage('100001')
      .matches(/^[a-zA-Z0-9]{30}$/).withMessage('100001'),
    query('state')
      .isString().withMessage('100002')
      .matches(/^[a-zA-Z0-9]{32}$/).withMessage('100003'),
    query('error')
      .optional()
      .isString().withMessage('100004'),
    cookie('discord_oauth_applications_entitlements_scope_state')
      .isString().withMessage('100005')
      .matches(/^[a-zA-Z0-9]{32}$/).withMessage('100005'),
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
    checkAuthentication,
    async (request, response) => {
      const nonce = crypto.randomBytes(16).toString('base64');

      function sendResponse(payload) {
        response.set({
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store',
          'Cross-Origin-Opener-Policy': 'unsafe-none',
          'Content-Security-Policy': `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; font-src 'self' https://fonts.gstatic.com;`
        });

        const htmlResponse = `<!DOCTYPE html>
          <html>
            <head>
              <script type="application/json" id="callback-data">${JSON.stringify(payload).replace(/</g, '\\u003c')}</script>
              <script nonce="${nonce}">
                var data = JSON.parse(document.getElementById('callback-data').textContent);
                window.opener.postMessage(data, ${JSON.stringify(frontendOrigin)});
                window.close();
              </script>
            </head>
            <body></body>
          </html>`;

        response.send(htmlResponse);
      }

      const validationErrors = validationResult(request);
      if (validationErrors.isEmpty() === false) return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_error', code: validationErrors.array()[0].msg });

      const { code, error, state, discord_oauth_applications_entitlements_scope_state: stateCookie } = matchedData(request);

      if (error) {
        if (error === 'access_denied') return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_access_denied' });
        return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_error', code: 100006, message: sanitizeHtml(error, sanitizeOptions) });
      }

      response.clearCookie('discord_oauth_applications_entitlements_scope_state');

      if (state !== stateCookie) return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_error', code: 100005 });

      try {
        const access_token = await getAccessToken(code, config.discordScopes.concat('applications.entitlements'), `${config.backendUrl}/auth/applicationsEntitlementsScope/callback`);
        await authCallback(access_token);

        await User.findOneAndUpdate({ id: request.user.id },
          {
            $set: {
              applicationsEntitlementsScopeGranted: true
            }
          }
        );

        return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_done' });
      } catch (error) {
        logger.error('There was an error while getting access token:', error);

        if (['100008', '100009', '100010'].includes(error.message)) return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_error', code: error.message });
        else return sendResponse({ type: 'discord_oauth_applications_entitlements_scope_error', code: 100006, message: sanitizeHtml(error.message, sanitizeOptions) });
      }
    }
  ]
};