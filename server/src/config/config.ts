import dotenv from 'dotenv';
import path from 'path';
import { AgentforceConfig, MCPConfig } from '../types/mcp';

// Load environment variables - prefer local .env file if it exists
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

// MCP Server Configuration
export const mcpConfig: MCPConfig = {
  serverPort: Number(process.env.PORT) || 3000,
  toolName: 'agentforce',
  toolDescription: 'Integrate with Salesforce Agentforce agents',
};

// Agentforce Configuration
export const agentforceConfig: AgentforceConfig = {
  clientId: process.env.AGENTFORCE_CLIENT_ID || '',
  clientSecret: process.env.AGENTFORCE_CLIENT_SECRET || '',
  orgBaseUrl: process.env.AGENTFORCE_ORG_BASE_URL || '',
  agentId: process.env.AGENTFORCE_AGENT_ID || '',
};

// Validate required configuration
export const validateConfig = (): string[] => {
  const errors: string[] = [];

  if (!agentforceConfig.clientId) {
    errors.push('Missing AGENTFORCE_CLIENT_ID in environment variables');
  }

  if (!agentforceConfig.clientSecret) {
    errors.push('Missing AGENTFORCE_CLIENT_SECRET in environment variables');
  }

  if (!agentforceConfig.orgBaseUrl) {
    errors.push('Missing AGENTFORCE_ORG_BASE_URL in environment variables');
  }

  if (!agentforceConfig.agentId) {
    errors.push('Missing AGENTFORCE_AGENT_ID in environment variables');
  }

  return errors;
};