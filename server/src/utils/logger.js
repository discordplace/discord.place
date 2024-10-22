const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, errors, printf, timestamp } = winston.format;
const { Console, DailyRotateFile, File } = winston.transports;

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
        datePattern: 'YYYY-MM-DD',
        filename: 'logs/%DATE%-error.log',
        level: 'error',
        maxFiles: '14d'
      }),
      new DailyRotateFile({
        datePattern: 'YYYY-MM-DD',
        filename: 'logs/%DATE%-combined.log',
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
        datePattern: 'YYYY-MM-DD',
        filename: 'logs/%DATE%-http.log',
        maxFiles: '14d'
      })
    ];

    this.logger = winston.createLogger({
      format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
        printf(({ level, message, stack, timestamp }) => {
          if (stack) return `${timestamp} ${level}: ${stack}`;

          return `${timestamp} ${level}: ${message}`;
        })
      ),
      level: 'info',
      levels: {
        debug: 3,
        error: 0,
        info: 2,
        warn: 1
      },
      transports
    });

    this.httpLogger = winston.createLogger({
      format: combine(
        timestamp({
          format: 'YYYY-MM-DD hh:mm:ss.SSS A'
        }),
        printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
      ),
      level: 'http',
      levels: {
        http: 0
      },
      transports: httpTransports
    });

    global.logger = this;
  }

  debug(...messages) {
    for (const message of messages) {
      this.logger.debug(message);
    }
  }

  error(...messages) {
    for (const message of messages) {
      this.logger.error(typeof message === 'object' ? inspect(message, { depth: 4 }) : message);
    }
  }

  http(...messages) {
    for (const message of messages) {
      this.httpLogger.log('http', message);
    }
  }

  info(...messages) {
    this.logger.info(messages.join(' '));
  }

  warn(...messages) {
    for (const message of messages) {
      this.logger.warn(message);
    }
  }
};