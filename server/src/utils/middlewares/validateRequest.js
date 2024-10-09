const { validationResult } = require('express-validator');

module.exports = async function validateRequest(request, response, next) {
  const errors = validationResult(request);
  if (!errors.isEmpty()) return response.sendError(errors.array()[0].msg, 400);

  next();
};