const winston = require('winston');

const logLevels = {
  levels: {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
  },
  colors: {
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warning: 'yellow',
    error: 'red',
    fatal: 'red',
  },
};

const developmentLogger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple()
  ),
  transports: [
    new winston.transports.Console({
      level: 'debug',
    }),
  ],
});

const productionLogger = winston.createLogger({
  levels: logLevels.levels,
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'errors.log', level: 'error' }),
    new winston.transports.Console({ level: 'info' }),
  ],
});

const logger = process.env.NODE_ENV === 'production' ? productionLogger : developmentLogger;

module.exports = logger;
