const createMongoBackup = require('@/utils/createMongoBackup');
const { CronJob } = require('cron');
const mongoose = require('mongoose');

module.exports = function connectDatabase(url, options = {}) {
  if (!url) throw new Error('Missing database URL.');

  mongoose.connect(url, { dbName: process.env.NODE_ENV === 'production' ? 'api' : 'development' })
    .then(() => logger.info('Connected to database.'));

  if (options.backup) {
    logger.info('Database backup enabled.');

    new CronJob('0 0 * * *', createMongoBackup, null, true);
  }
};