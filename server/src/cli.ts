#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import dotenv from 'dotenv';
import { agentforceConfig, validateConfig } from './config/config';

// Get the path to the .env file
const envFilePath = path.resolve(process.cwd(), '.env');

// Create or update the .env file with user inputs
async function setupEnvFile(): Promise<void> {
  console.log('Welcome to Agentforce MCP Server Setup!');
  console.log('Enter your Salesforce Agentforce credentials:');

  // Load existing .env if it exists
  let existingEnv: Record<string, string> = {};
  if (fs.existsSync(envFilePath)) {
    existingEnv = dotenv.parse(fs.readFileSync(envFilePath));
  }
  
  // Reload dotenv with current file to ensure we have the latest values
  dotenv.config({ path: envFilePath });

  // Define the questions for prompts
  const questions = [
    {
      type: 'text' as const,
      name: 'clientId',
      message: 'Salesforce Client ID:',
      initial: existingEnv.AGENTFORCE_CLIENT_ID || agentforceConfig.clientId
    },
    {
      type: 'text' as const,
      name: 'clientSecret',
      message: 'Salesforce Client Secret:',
      initial: existingEnv.AGENTFORCE_CLIENT_SECRET || agentforceConfig.clientSecret
    },
    {
      type: 'text' as const,
      name: 'orgBaseUrl',
      message: 'Salesforce Org Base URL:',
      initial: existingEnv.AGENTFORCE_ORG_BASE_URL || agentforceConfig.orgBaseUrl
    },
    {
      type: 'text' as const,
      name: 'agentId',
      message: 'Agentforce Agent ID:',
      initial: existingEnv.AGENTFORCE_AGENT_ID || agentforceConfig.agentId
    },
    {
      type: 'number' as const,
      name: 'port',
      message: 'Server Port:',
      initial: existingEnv.PORT ? parseInt(existingEnv.PORT) : 3000
    }
  ];

  try {
    // Ask the questions
    const response = await prompts(questions);

    // Create .env content
    const envContent = `# Agentforce MCP Server Configuration
AGENTFORCE_CLIENT_ID=${response.clientId}
AGENTFORCE_CLIENT_SECRET=${response.clientSecret}
AGENTFORCE_ORG_BASE_URL=${response.orgBaseUrl}
AGENTFORCE_AGENT_ID=${response.agentId}
PORT=${response.port}
`;

    // Write to .env file
    fs.writeFileSync(envFilePath, envContent);
    console.log('.env file has been created/updated successfully!');
    
    // Set environment variables for the current process
    process.env.AGENTFORCE_CLIENT_ID = response.clientId;
    process.env.AGENTFORCE_CLIENT_SECRET = response.clientSecret;
    process.env.AGENTFORCE_ORG_BASE_URL = response.orgBaseUrl;
    process.env.AGENTFORCE_AGENT_ID = response.agentId;
    process.env.PORT = String(response.port);
    
    // Start the server
    import('./index').catch(error => {
      console.error('Failed to start the server:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Setup was cancelled or encountered an error:', error);
    process.exit(1);
  }
}

// Setup the server
async function startServer() {
  // Load .env file first
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  }
  
  // Check if config is already valid
  const configErrors = validateConfig();
  if (configErrors.length === 0) {
    // If configuration is valid, start the server directly
    console.log('Using existing configuration from environment variables.');
    import('./index').catch(error => {
      console.error('Failed to start the server:', error);
      process.exit(1);
    });
  } else {
    // If configuration is missing or invalid, prompt for values
    await setupEnvFile();
  }
}

startServer();