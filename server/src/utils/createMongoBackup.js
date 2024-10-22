const mongoose = require('mongoose');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);
const moment = require('moment');
const fs = require('node:fs');
const path = require('node:path');
const archiver = require('archiver');
const sendHeartbeat = require('@/utils/sendHeartbeat');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const S3 = new S3Client({
  region: process.env.S3_DATABASE_BACKUP_REGION,
  endpoint: process.env.S3_DATABASE_BACKUP_ENDPOINT,
  credentials: {
    accessKeyId: process.env.S3_DATABASE_BACKUP_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_DATABASE_BACKUP_SECRET_ACCESS_KEY
  }
});

async function createMongoBackup() {
  try {
    if (!mongoose?.connection?.client?.s?.url) throw new Error('Database connection not established.');

    logger.info('Taking backup of database..');

    const url = mongoose.connection.client.s.url;
    const formattedDate = moment().format('YYYY/MM/DD');
    const backupPath = `./src/database/backups/${formattedDate}`;
    const cmd = generateBackupCommand(url, backupPath, config.excludeCollectionsInBackup);

    await executeBackupCommand(cmd);

    logger.info('Database backup taken successfully.');

    await zipBackupFolder(backupPath);
    await uploadBackupToS3(`${backupPath}/backup.zip`, `${formattedDate}/backup.zip`);

    sendHeartbeat(process.env.HEARTBEAT_ID_DAILY_DATABASE_BACKUP, 0);

    logger.info('Database backup uploaded to S3 successfully.');
  } catch (error) {
    logger.error('Failed to take backup:', error);

    sendHeartbeat(process.env.HEARTBEAT_ID_DAILY_DATABASE_BACKUP, 1);
  }
}

function generateBackupCommand(url, backupPath, excludeCollections) {
  const collectionsToExclude = excludeCollections.map(collection => `--excludeCollection=${collection}`).join(' ');

  return `mongodump --uri="${url}" --gzip --forceTableScan --quiet --db=api --out=${backupPath} ${collectionsToExclude}`;
}

async function executeBackupCommand(cmd) {
  try {
    await exec(cmd);
  } catch (error) {
    throw new Error(`Backup command execution failed: ${error.message}`);
  }
}

async function zipBackupFolder(backupPath) {
  return new Promise((resolve, reject) => {
    const files = fs.readdirSync(`${backupPath}/api`);

    const zipFileName = `${backupPath}/backup.zip`;

    const output = fs.createWriteStream(zipFileName);

    const archive = archiver('zip', {
      zlib: { level: 9 }
    });

    output.on('close', resolve);

    archive.on('error', error => reject(`Failed to zip backup folder: ${error.message}`));

    archive.pipe(output);

    files.forEach(file => {
      archive.file(path.join(backupPath, 'api', file), { name: file });
    });

    archive.finalize();
  });
}

async function uploadBackupToS3(zipFilePath, zipFileName) {
  const file = fs.readFileSync(zipFilePath);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_DATABASE_BACKUP_BUCKET_NAME,
    Key: zipFileName,
    Body: file,
    ContentType: 'application/zip'
  });

  return S3.send(command)
    .finally(() => fs.unlinkSync(zipFilePath));
}

module.exports = createMongoBackup;