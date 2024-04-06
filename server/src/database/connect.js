const mongoose = require('mongoose');
const createMongoBackup = require('@/utils/createMongoBackup');
const { CronJob } = require('cron');

module.exports = function connectDatabase(url, options = {}) {
  if (!url) throw new Error('Missing database URL.');

  mongoose.connect(url, { dbName: process.env.NODE_ENV === 'production' ? 'api' : 'development' })
    .then(() => logger.send('Connected to database.'));

  if (options.backup) {
    logger.send('Database backup enabled.');
    new CronJob('0 0 * * 0', () => createMongoBackup, null, true);
  }
};