import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { router } from './routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(
  cors({
    origin: env.NODE_ENV === 'development' ? 'http://localhost:5173' : [],
    credentials: true,
  }),
);

app.use(express.json({ limit: '10kb' }));

app.use((_, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  next();
});

app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api', router);

app.use(errorHandler);

export { app };
