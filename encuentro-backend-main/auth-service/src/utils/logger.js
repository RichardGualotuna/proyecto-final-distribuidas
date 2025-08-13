const { format, createLogger, transports } = require('winston');

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.printf(({ timestamp, level, message, stack }) => {
      return `[${timestamp}] ${level}: ${message}${stack ? `\n${stack}` : ''}`;
    })
  ),
  transports: [new transports.Console()]
});

module.exports = logger;