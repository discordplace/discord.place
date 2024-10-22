module.exports = function (request, response, next) {
  response.sendError = (message, status) => {
    response.status(status || 500).json({
      error: message,
      status: status || 500,
      success: false
    });
  };

  next();
};