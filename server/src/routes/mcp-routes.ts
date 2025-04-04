import express from 'express';
import { MCPController } from '../controllers/mcp-controller';

const router = express.Router();
const mcpController = new MCPController();

// MCP endpoints
router.get('/manifest', mcpController.getManifest);
router.post('/execute', mcpController.executeRequest);

export default router;