const crypto = require('crypto');
const { cookie, matchedData, query, validationResult } = require('express-validator');
const useRateLimiter = require('@/utils/useRateLimiter');
const getAccessToken = require('@/utils/getAccessToken');
const authCallback = require('@/utils/authCallback');
const sanitizeHtml = require('sanitize-html');
const authCookieName = require('@/utils/authCookie');

const sanitizeOptions = { allowedTags: [], allowedAttributes: {} };
const frontendOrigin = config.frontendUrl || 'http://localhost:5000';

module.exports = {
  get: [
    query('code')
      .isString().withMessage('100001')
      .matches(/^[a-zA-Z0-9]{30}$/).withMessage('100001'),
    query('state')
      .isString().withMessage('100002')
      .matches(/^[a-zA-Z0-9]{32}$/).withMessage('100002'),
    query('error')
      .optional()
      .isString().withMessage('100003'),
    cookie('discord_oauth_redirect')
      .optional()
      .isURL().withMessage('100004')
      .custom(value => {
        const redirectUrl = new URL(value);
        if (process.env.NODE_ENV === 'production' && redirectUrl.origin !== config.frontendUrl) throw new Error('100004');

        return true;
      }),
    cookie('discord_oauth_state')
      .isString().withMessage('100005'),
    useRateLimiter({ maxRequests: 10, perMinutes: 1 }),
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
      if (validationErrors.isEmpty() === false) return sendResponse({ type: 'discord_oauth_error', code: validationErrors.array()[0].msg });

      const { code, state, discord_oauth_redirect: redirectCookie, discord_oauth_state: stateCookie, error } = matchedData(request);

      if (error) {
        if (error === 'access_denied') return sendResponse({ type: 'discord_oauth_access_denied' });
        return sendResponse({ type: 'discord_oauth_error', code: 100006, message: sanitizeHtml(error, sanitizeOptions) });
      }

      response.clearCookie('discord_oauth_redirect');
      response.clearCookie('discord_oauth_state');

      if (state !== stateCookie) return sendResponse({ type: 'discord_oauth_error', code: 100005 });

      try {
        const access_token = await getAccessToken(code, config.discordScopes, `${config.backendUrl}/auth/callback`);
        const callbackResponse = await authCallback(access_token);

        response.cookie(
          authCookieName,
          callbackResponse.token,
          {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            sameSite: 'lax',
            ...(process.env.NODE_ENV === 'production' && {
              domain: `.${new URL(config.frontendUrl).hostname}`
            })
          }
        );

        return sendResponse({ type: 'discord_oauth_done', redirect: redirectCookie ? sanitizeHtml(redirectCookie, sanitizeOptions) : null });
      } catch (error) {
        logger.error('There was an error while getting access token:', error);

        if (['100008', '100009', '100010'].includes(error.message)) return sendResponse({ type: 'discord_oauth_error', code: error.message });
        else return sendResponse({ type: 'discord_oauth_error', code: 100006, message: sanitizeHtml(error.message, sanitizeOptions) });
      }
    }
  ]
};