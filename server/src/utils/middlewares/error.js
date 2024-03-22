module.exports = function (request, response, next) {
  response.sendError = (message, status) => {
    response.status(status || 500).json({
      success: false,
      error: message,
      status: status || 500
    });
    logger.send(`<-- ${response.statusCode} ${message}`);
  };
  
  next();
};