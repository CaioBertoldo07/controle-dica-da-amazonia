import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import pinoHttp from 'pino-http';
import { env } from './config/env';
import { logger } from './config/logger';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// ─── Security headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── CORS ─────────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : [],
    credentials: true,
  }),
);

// ─── Compression ──────────────────────────────────────────────────────────────
app.use(compression());

// ─── Request logging ──────────────────────────────────────────────────────────
if (env.NODE_ENV !== 'test') {
  app.use(
    pinoHttp({
      logger,
      customLogLevel(_req, res, err) {
        if (err) return 'error';
        if (res.statusCode >= 500) return 'error';
        if (res.statusCode >= 400) return 'warn';
        return 'info';
      },
      serializers: {
        req(req) {
          return { method: req.method, url: req.url };
        },
        res(res) {
          return { statusCode: res.statusCode };
        },
      },
    }),
  );
}

// ─── Rate limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Muitas requisições. Tente novamente em breve.' },
  skip: () => env.NODE_ENV === 'test',
});

app.use(limiter);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));

app.use((_req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api', router);

// ─── Error handler ────────────────────────────────────────────────────────────
app.use(errorHandler);

export { app };
