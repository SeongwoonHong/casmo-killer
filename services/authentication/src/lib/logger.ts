import {
  addColors,
  createLogger,
  format,
  Logger,
  transports,
} from 'winston';
import { FormatWrap } from 'logform';

import { configs } from '~config';

const errorFormat: FormatWrap = format(<TransformFunction>(info) => {
  const splat = (info && info[Symbol.for('splat')]) || [];
  const e = splat.length && splat[splat.length - 1];

  if (e instanceof Error) {
    return {
      ...(info || {}),
      stack: e.stack,
      [Symbol.for('splat')]: splat.splice(
        splat.length - 1,
        1, e.message,
      ),
    };
  }
  return info;
});

export const logger: Logger = createLogger({
  level: configs.API_LOG_LEVEL,
  silent: configs.NODE_ENV === 'test',
  transports: [
    new transports.Console({
      format: format.combine(
        errorFormat(),
        format.colorize(),
        format.splat(),
        format.simple(),
      ),
    }),
  ],
});

addColors({
  debug: 'white',
  error: 'red',
  info: 'green',
  warn: 'yellow',
});

export const stream = {
  write: (message) => {
    logger.info(message);
  },
};
