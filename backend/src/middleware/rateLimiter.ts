import { Request, Response, NextFunction } from 'express';

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const stores = new Map<string, Map<string, RateLimitStore>>();

export const createRateLimiter = (options: {
  name: string;
  windowMs: number;
  max: number;
  message?: string;
}) => {
  if (!stores.has(options.name)) {
    stores.set(options.name, new Map());
  }
  const store = stores.get(options.name)!;

  // Periodic cleanup every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of store.entries()) {
      if (now > value.resetTime) {
        store.delete(key);
      }
    }
  }, 5 * 60 * 1000);

  return (req: Request, res: Response, next: NextFunction): void => {
    // Skip rate limiting during automated test suites
    if (process.env.NODE_ENV === 'test') {
      next();
      return;
    }

    const ip = req.ip || req.socket.remoteAddress || 'unknown-client';
    const now = Date.now();
    const entry = store.get(ip);

    if (!entry || now > entry.resetTime) {
      store.set(ip, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      next();
      return;
    }

    entry.count += 1;

    if (entry.count > options.max) {
      const retryAfterSeconds = Math.ceil((entry.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.status(429).json({
        success: false,
        message: options.message || `Too many requests. Please try again after ${retryAfterSeconds} seconds.`,
      });
      return;
    }

    next();
  };
};

export const authRateLimiter = createRateLimiter({
  name: 'auth',
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 attempts per 15 minutes
  message: 'Too many authentication attempts from this IP address. Please try again in 15 minutes.',
});

export const aiRateLimiter = createRateLimiter({
  name: 'ai-planner',
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20, // 20 itineraries per 5 minutes
  message: 'AI itinerary request rate limit reached. Please wait a few moments before generating another plan.',
});
