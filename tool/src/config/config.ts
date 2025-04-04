import dotenv from 'dotenv';
import path from 'path';

// Load environment variables - prefer local .env file if it exists
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// Tool Configuration
export const toolConfig = {
  serverUrl: process.env.SERVER_URL || 'http://localhost:3000/api',
  port: Number(process.env.TOOL_PORT) || 3001,
};

// Validate required configuration
export const validateConfig = (): string[] => {
  const errors: string[] = [];

  if (!toolConfig.serverUrl) {
    errors.push('Missing SERVER_URL in environment variables');
  }

  return errors;
};