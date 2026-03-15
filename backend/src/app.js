import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { apiRouter } from './routes/v1/index.js';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware.js';

const app = express();
app.use(helmet());
app.use(cors({ origin: env.corsOrigin, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get('/health', (_, res) => res.json({ ok: true }));
app.use('/api/v1', apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
