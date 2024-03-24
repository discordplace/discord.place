const mongoose = require('mongoose');

module.exports = function connectDatabase(url) {
  if (!url) throw new Error('Missing database URL.');

  mongoose.connect(url, {  dbName: process.env.NODE_ENV === 'production' ? 'api' : 'development' })
    .then(() => logger.send('Connected to database.'));
};