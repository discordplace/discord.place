const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, errors, printf, timestamp } = winston.format;
const { Console, File, DailyRotateFile } = winston.transports;

const { inspect } = require('util');

module.exports = class Logger {
  constructor() {
    const transports = [
      new Console(),
      new File({
        filename: 'logs/error.log',
        level: 'error',
        zippedArchive: true
      }),
      new File({
        filename: 'logs/combined.log',
        zippedArchive: true
      }),
      new DailyRotateFile({
        filename: 'logs/%DATE%-error.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d',
        level: 'error'
      }),
      new DailyRotateFile({
        filename: 'logs/%DATE%-combined.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d'
      })
    ];

    const httpTransports = [
      new Console(),
      new File({
        filename: 'logs/http.log',
        zippedArchive: true
      }),
      new DailyRotateFile({
        filename: 'logs/%DATE%-http.log',
        datePattern: 'YYYY-MM-DD',
        maxFiles: '14d'
      })
    ];

    this.logger = winston.createLogger({
      levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
      },
      level: 'info',
      format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        printf(({ level, message, timestamp, stack }) => {
          if (stack) return `${timestamp} ${level}: ${stack}`;

          return `${timestamp} ${level}: ${message}`;
        })
      ),
      transports
    });

    this.httpLogger = winston.createLogger({
      levels: {
        http: 0
      },
      level: 'http',
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
      ),
      transports: httpTransports
    });

    global.logger = this;
  }

  info(...messages) {
    this.logger.info(messages.join(' '));
  }

  error(...messages) {
    for (const message of messages) {
      this.logger.error(typeof message === 'object' ? inspect(message, { depth: 4 }) : message);
    }
  }

  warn(...messages) {
    for (const message of messages) {
      this.logger.warn(message);
    }
  }

  debug(...messages) {
    for (const message of messages) {
      this.logger.debug(message);
    }
  }

  http(...messages) {
    for (const message of messages) {
      this.httpLogger.log('http', message);
    }
  }
};