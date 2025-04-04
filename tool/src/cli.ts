#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import prompts from 'prompts';
import dotenv from 'dotenv';
import { toolConfig } from './config/config';

// Get the path to the .env file
const envFilePath = path.resolve(process.cwd(), '.env');

// Create or update the .env file with user inputs
async function setupEnvFile(): Promise<void> {
  console.log('Welcome to Agentforce MCP Tool Setup!');
  
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
      name: 'serverUrl',
      message: 'Server URL:',
      initial: existingEnv.SERVER_URL || toolConfig.serverUrl
    },
    {
      type: 'number' as const,
      name: 'port',
      message: 'Tool Port:',
      initial: existingEnv.TOOL_PORT ? parseInt(existingEnv.TOOL_PORT) : 3001
    }
  ];

  try {
    // Ask the questions
    const response = await prompts(questions);

    // Create .env content
    const envContent = `# Agentforce MCP Tool Configuration
SERVER_URL=${response.serverUrl}
TOOL_PORT=${response.port}
`;

    // Write to .env file
    fs.writeFileSync(envFilePath, envContent);
    console.log('.env file has been created/updated successfully!');
    
    // Set environment variables for the current process
    process.env.SERVER_URL = response.serverUrl;
    process.env.TOOL_PORT = String(response.port);
    
    // Start the tool
    import('./index').catch(error => {
      console.error('Failed to start the tool:', error);
      process.exit(1);
    });
    
  } catch (error) {
    console.error('Setup was cancelled or encountered an error:', error);
    process.exit(1);
  }
}

// Setup the tool
async function startTool() {
  // Load .env file first
  if (fs.existsSync(envFilePath)) {
    dotenv.config({ path: envFilePath });
  }
  
  // Check if port is already in use
  const portToCheck = Number(process.env.TOOL_PORT) || 3001;
  
  try {
    // Start setup if needed
    await setupEnvFile();
  } catch (error) {
    console.error('Failed to start the tool:', error);
    process.exit(1);
  }
}

startTool();