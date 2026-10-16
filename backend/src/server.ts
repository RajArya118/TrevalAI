import app from './app.js';
import { config } from './config/index.js';
import { prisma } from './config/prisma.js';

const startServer = async () => {
  try {
    // Verify database connection on startup
    await prisma.$connect();
    console.log('✅ PostgreSQL Database connected successfully via Prisma');

    const server = app.listen(config.port, () => {
      console.log(`🚀 TravelAI Backend running on http://localhost:${config.port}`);
      console.log(`📍 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`🤖 AI Engine: ${config.isAiDemoMode ? 'Demo Simulator (Fallback Active)' : 'Live Google Gemini'}`);
    });

    const shutdown = async () => {
      console.log('\nGracefully shutting down TravelAI Server...');
      server.close(async () => {
        await prisma.$disconnect();
        console.log('PostgreSQL disconnected. Server stopped.');
        process.exit(0);
      });
    };

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Failed to start TravelAI server:', error);
    process.exit(1);
  }
};

startServer();
