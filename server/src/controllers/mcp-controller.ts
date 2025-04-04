import { Request, Response } from 'express';
import { AgentforceSessionService } from '../services/agentforce-session';
import { AgentforceMessagingService } from '../services/agentforce-messaging';
import { MCPManifest, MCPRequest, MCPResponse } from '../types/mcp';
import { mcpConfig } from '../config/config';

/**
 * Controller for MCP protocol endpoints
 */
export class MCPController {
  private sessionService: AgentforceSessionService;
  private messagingService: AgentforceMessagingService;
  private manifest: MCPManifest;

  constructor() {
    this.sessionService = new AgentforceSessionService();
    this.messagingService = new AgentforceMessagingService(this.sessionService);
    
    // Initialize MCP manifest
    this.manifest = {
      schema_version: '202206',
      metadata: {
        name: mcpConfig.toolName,
        description: mcpConfig.toolDescription
      },
      tools: [
        {
          name: 'create_session',
          description: 'Create a new session with Agentforce agent',
          input_schema: {
            type: 'object',
            properties: {},
            required: []
          },
          output_schema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'The session ID to use for subsequent requests'
              }
            }
          }
        },
        {
          name: 'send_message',
          description: 'Send a message to the Agentforce agent',
          input_schema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'The session ID from create_session'
              },
              message: {
                type: 'string',
                description: 'The message to send to the agent'
              }
            },
            required: ['sessionId', 'message']
          },
          output_schema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The agent response message'
              }
            }
          }
        },
        {
          name: 'end_session',
          description: 'End the session with the Agentforce agent',
          input_schema: {
            type: 'object',
            properties: {
              sessionId: {
                type: 'string',
                description: 'The session ID to end'
              }
            },
            required: ['sessionId']
          },
          output_schema: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: 'Whether the session was ended successfully'
              }
            }
          }
        }
      ]
    };
  }

  /**
   * Get MCP manifest
   */
  public getManifest = async (req: Request, res: Response): Promise<void> => {
    res.json(this.manifest);
  };

  /**
   * Execute MCP request
   */
  public executeRequest = async (req: Request, res: Response): Promise<void> => {
    try {
      const mcpRequest: MCPRequest = req.body;
      let mcpResponse: MCPResponse;

      switch (mcpRequest.tool) {
        case 'create_session':
          mcpResponse = await this.createSession();
          break;

        case 'send_message':
          mcpResponse = await this.sendMessage(mcpRequest.parameters);
          break;

        case 'end_session':
          mcpResponse = await this.endSession(mcpRequest.parameters);
          break;

        default:
          mcpResponse = {
            status: 'error',
            error: {
              type: 'INVALID_TOOL',
              message: `Tool ${mcpRequest.tool} is not supported`
            }
          };
      }

      res.json(mcpResponse);
    } catch (error: any) {
      const errorResponse: MCPResponse = {
        status: 'error',
        error: {
          type: 'EXECUTION_ERROR',
          message: error.message || 'Unknown error occurred'
        }
      };

      res.status(500).json(errorResponse);
    }
  };

  /**
   * Create Agentforce session
   */
  private async createSession(): Promise<MCPResponse> {
    try {
      const session = await this.sessionService.createSession();
      
      return {
        status: 'success',
        result: {
          sessionId: session.sessionId
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          type: 'SESSION_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Send message to Agentforce
   */
  private async sendMessage(parameters: Record<string, any>): Promise<MCPResponse> {
    try {
      const { sessionId, message } = parameters;
      
      if (!sessionId || !message) {
        return {
          status: 'error',
          error: {
            type: 'INVALID_PARAMETERS',
            message: 'sessionId and message are required'
          }
        };
      }
      
      const response = await this.messagingService.sendMessage(sessionId, message);
      
      return {
        status: 'success',
        result: {
          message: response.message
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          type: 'MESSAGE_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * End Agentforce session
   */
  private async endSession(parameters: Record<string, any>): Promise<MCPResponse> {
    try {
      const { sessionId } = parameters;
      
      if (!sessionId) {
        return {
          status: 'error',
          error: {
            type: 'INVALID_PARAMETERS',
            message: 'sessionId is required'
          }
        };
      }
      
      const success = await this.sessionService.endSession(sessionId);
      
      return {
        status: 'success',
        result: {
          success
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          type: 'SESSION_ERROR',
          message: error.message
        }
      };
    }
  }
}