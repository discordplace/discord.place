const mongoose = require('mongoose');
const createMongoBackup = require('@/utils/createMongoBackup');
const { CronJob } = require('cron');

module.exports = function connectDatabase(url, options = {}) {
  if (!url) throw new Error('Missing database URL.');

  const appEnv = process.env.APP_ENV || process.env.NODE_ENV;
  const dbName = process.env.MONGO_DB_NAME || (appEnv === 'production' ? 'api' : appEnv === 'staging' ? 'staging' : 'development');

  mongoose.connect(url, { dbName })
    .then(() => logger.info('Connected to database.'));

  if (options.backup) {
    const requiredEnvironmentVariables = [
      'S3_DATABASE_BACKUP_BUCKET_NAME',
      'S3_DATABASE_BACKUP_ACCESS_KEY_ID',
      'S3_DATABASE_BACKUP_SECRET_ACCESS_KEY',
      'S3_DATABASE_BACKUP_REGION',
      'S3_DATABASE_BACKUP_ENDPOINT'
    ];

    if (requiredEnvironmentVariables.some(variable => !process.env[variable])) {
      logger.warn(`Missing required environment variables for database backup: ${requiredEnvironmentVariables.join(', ')}`);
      logger.warn('Database backup will not be enabled.');
    } else {
      logger.info('Database backup enabled.');

      new CronJob('0 0 * * *', createMongoBackup, null, true);
    }
  }
};