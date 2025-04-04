import express from 'express';
import { toolConfig, validateConfig } from './config/config';

// Validate configuration
const configErrors = validateConfig();
if (configErrors.length > 0) {
  console.error('Configuration errors:');
  configErrors.forEach(error => console.error(`- ${error}`));
  console.error('Please set the required environment variables and restart the tool.');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Proxy MCP requests to the server
app.all('*', async (req, res) => {
  const url = `${toolConfig.serverUrl}${req.url}`;
  
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...req.headers as any
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined
    });
    
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Error proxying request:', error.message);
    res.status(500).json({
      status: 'error',
      error: {
        type: 'PROXY_ERROR',
        message: error.message
      }
    });
  }
});

// Start server
try {
  app.listen(toolConfig.port, () => {
    console.log(`Simple Agentforce MCP Tool is running on port ${toolConfig.port}`);
    console.log(`Add the following URL to Claude Desktop: http://localhost:${toolConfig.port}`);
  });
} catch (error: any) {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${toolConfig.port} is already in use. Please choose a different port by setting the TOOL_PORT environment variable.`);
    console.error(`You can run the tool again with a different port using:`);
    console.error(`TOOL_PORT=3002 agentforce-tool`);
    process.exit(1);
  } else {
    throw error;
  }
}