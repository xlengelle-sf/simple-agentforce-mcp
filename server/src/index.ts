import express from 'express';
import cors from 'cors';
import { mcpConfig, validateConfig } from './config/config';
import mcpRoutes from './routes/mcp-routes';

// Validate configuration
const configErrors = validateConfig();
if (configErrors.length > 0) {
  console.error('Configuration errors:');
  configErrors.forEach(error => console.error(`- ${error}`));
  console.error('Please set the required environment variables and restart the server.');
  process.exit(1);
}

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', mcpRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(mcpConfig.serverPort, () => {
  console.log(`Simple Agentforce MCP Server is running on port ${mcpConfig.serverPort}`);
  console.log(`MCP API is available at http://localhost:${mcpConfig.serverPort}/api`);
});