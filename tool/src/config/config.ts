import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

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