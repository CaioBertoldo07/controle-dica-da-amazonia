import pino from 'pino';

const prettyTransport = (() => {
  if (process.env.NODE_ENV === 'production') {
    return undefined;
  }

  try {
    require.resolve('pino-pretty');

    return {
      target: 'pino-pretty',
      options: { colorize: true, translateTime: 'SYS:standard' },
    };
  } catch {
    return undefined;
  }
})();

export const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: prettyTransport,
});
