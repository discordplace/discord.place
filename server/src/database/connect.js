const mongoose = require('mongoose');

module.exports = function connectDatabase(url) {
  if (!url) throw new Error('Missing database URL.');
  mongoose.connect(url, { dbName: 'api' }).then(() => logger.send('Connected to database.'));
};