const winston = require('winston');
require('winston-daily-rotate-file');

const { combine, errors, printf, timestamp } = winston.format;
const { Console, File, DailyRotateFile } = winston.transports;

const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');

module.exports = class Logger {
  constructor() {
    const loggerTransports = [
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

    const httpLoggerTransports = [
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

    if (process.env.NODE_ENV === 'production' && process.env.LOGTAIL_SOURCE_TOKEN) {
      const logtail = new Logtail(process.env.LOGTAIL_SOURCE_TOKEN);

      loggerTransports.push(new LogtailTransport(logtail));
      httpLoggerTransports.push(new LogtailTransport(logtail));
    }

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
      transports: loggerTransports
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
      transports: httpLoggerTransports
    });

    global.logger = this;
  }

  info(messages) {
    this.logger.info(messages);
  }

  error(messages) {
    this.logger.error(messages);
  }

  warn(messages) {
    this.logger.warn(messages);
  }

  debug(messages) {
    this.logger.debug(messages);
  }

  http(message) {
    this.httpLogger.log('http', message);
  }
};
