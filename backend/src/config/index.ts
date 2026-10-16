import dotenv from 'dotenv';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

// Enforce mandatory secrets in production
if (nodeEnv === 'production') {
  if (!process.env.JWT_SECRET) {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET must be configured in production environment variables.');
  }
  if (!process.env.DATABASE_URL) {
    throw new Error('FATAL CONFIGURATION ERROR: DATABASE_URL must be configured in production environment variables.');
  }
}

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv,
  jwtSecret: process.env.JWT_SECRET || 'travelai_jwt_dev_secret_key_2026',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/travelai_app?schema=public',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  isAiDemoMode: !process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.trim() === '',
};
