import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRoutes from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './utils/errors.js';

const app = express();

// Security: Disable express fingerprinting
app.disable('x-powered-by');

// Security Headers Middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Production & Development CORS Configuration
const allowedStaticOrigins = [
  config.frontendUrl,
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow server-to-server or curl/mobile requests without origin header
      if (!origin) return callback(null, true);

      const isAllowed =
        allowedStaticOrigins.includes(origin) ||
        (config.nodeEnv === 'development' && /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`CORS error: Origin '${origin}' is not authorized.`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Development Request Logger
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
    });
    next();
  });
}

// API Routes
app.use('/api', apiRoutes);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res, next) => {
  next(new NotFoundError(`Endpoint '${req.originalUrl}' not found.`));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
