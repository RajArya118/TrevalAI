import { Router, Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { config } from '../config/index.js';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  let dbStatus = 'ok';
  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err: any) {
    dbStatus = `error: ${err.message}`;
  }

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.nodeEnv,
    services: {
      database: dbStatus,
      aiEngine: config.isAiDemoMode ? 'demo-engine-active' : 'gemini-live-active',
    },
  });
});

export default router;
