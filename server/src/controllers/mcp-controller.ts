import { Request, Response } from 'express';
import { AgentforceSessionService } from '../services/agentforce-session';
import { AgentforceMessagingService } from '../services/agentforce-messaging';
import { MCPManifest, MCPRequest, MCPResponse, StreamResponseType } from '../types/mcp';
import { mcpConfig } from '../config/config';

/**
 * Controller for MCP protocol endpoints
 */
export class MCPController {
  private sessionService: AgentforceSessionService;
  private messagingService: AgentforceMessagingService;
  private manifest: MCPManifest;
  private streamMessages: Map<string, any[]> = new Map();

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
          name: 'send_message_stream',
          description: 'Send a message to the Agentforce agent with streaming response',
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
              streamId: {
                type: 'string',
                description: 'The ID of the stream to use for retrieving streaming responses'
              }
            }
          }
        },
        {
          name: 'get_stream_message',
          description: 'Get a message chunk from a streaming response',
          input_schema: {
            type: 'object',
            properties: {
              streamId: {
                type: 'string',
                description: 'The stream ID from send_message_stream'
              }
            },
            required: ['streamId']
          },
          output_schema: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'The type of chunk: "chunk", "complete", or "error"'
              },
              data: {
                type: 'string',
                description: 'The message chunk data (if type is "chunk" or "complete")'
              },
              error: {
                type: 'string',
                description: 'The error message (if type is "error")'
              }
            }
          }
        },
        {
          name: 'cancel_stream',
          description: 'Cancel an active streaming message',
          input_schema: {
            type: 'object',
            properties: {
              streamId: {
                type: 'string',
                description: 'The stream ID to cancel'
              }
            },
            required: ['streamId']
          },
          output_schema: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: 'Whether the stream was cancelled successfully'
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

        case 'send_message_stream':
          mcpResponse = await this.sendMessageStream(mcpRequest.parameters);
          break;

        case 'get_stream_message':
          mcpResponse = await this.getStreamMessage(mcpRequest.parameters);
          break;

        case 'cancel_stream':
          mcpResponse = await this.cancelStream(mcpRequest.parameters);
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
   * Send message to Agentforce with streaming response
   */
  private async sendMessageStream(parameters: Record<string, any>): Promise<MCPResponse> {
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
      
      // Get session
      const session = this.sessionService.getSession(sessionId);
      if (!session) {
        return {
          status: 'error',
          error: {
            type: 'SESSION_ERROR',
            message: 'Session not found'
          }
        };
      }
      
      // Create stream ID
      const sequenceId = session.sequenceId + 1; // We're going to increment it in the service
      const streamId = `${sessionId}-${sequenceId}`;
      
      // Initialize message queue for this stream
      this.streamMessages.set(streamId, []);
      
      // Start streaming
      const emitter = await this.messagingService.sendMessageStream(sessionId, message);
      
      // Set up listener to capture messages
      emitter.on('message', (event) => {
        const messages = this.streamMessages.get(streamId) || [];
        messages.push(event);
        this.streamMessages.set(streamId, messages);
      });
      
      return {
        status: 'success',
        result: {
          streamId
        }
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          type: 'STREAM_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Get message from stream
   */
  private async getStreamMessage(parameters: Record<string, any>): Promise<MCPResponse> {
    try {
      const { streamId } = parameters;
      
      if (!streamId) {
        return {
          status: 'error',
          error: {
            type: 'INVALID_PARAMETERS',
            message: 'streamId is required'
          }
        };
      }
      
      // Get messages for this stream
      const messages = this.streamMessages.get(streamId) || [];
      
      if (messages.length === 0) {
        // No messages yet, return empty result
        return {
          status: 'success',
          result: {
            type: 'waiting'
          }
        };
      }
      
      // Get the next message
      const message = messages.shift();
      this.streamMessages.set(streamId, messages);
      
      // If this is a completion message, clean up
      if (message.type === StreamResponseType.COMPLETE || message.type === StreamResponseType.ERROR) {
        this.streamMessages.delete(streamId);
      }
      
      return {
        status: 'success',
        result: message
      };
    } catch (error: any) {
      return {
        status: 'error',
        error: {
          type: 'STREAM_ERROR',
          message: error.message
        }
      };
    }
  }

  /**
   * Cancel streaming message
   */
  private async cancelStream(parameters: Record<string, any>): Promise<MCPResponse> {
    try {
      const { streamId } = parameters;
      
      if (!streamId) {
        return {
          status: 'error',
          error: {
            type: 'INVALID_PARAMETERS',
            message: 'streamId is required'
          }
        };
      }
      
      // Parse session ID and sequence ID from stream ID
      const [sessionId, sequenceIdStr] = streamId.split('-');
      const sequenceId = parseInt(sequenceIdStr, 10);
      
      if (!sessionId || isNaN(sequenceId)) {
        return {
          status: 'error',
          error: {
            type: 'INVALID_PARAMETERS',
            message: 'Invalid streamId format'
          }
        };
      }
      
      // Cancel the stream
      const success = this.messagingService.cancelStream(sessionId, sequenceId);
      
      // Clean up
      if (success) {
        this.streamMessages.delete(streamId);
      }
      
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
          type: 'STREAM_ERROR',
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
      
      // Clean up any streaming messages for this session
      for (const [streamId, _] of this.streamMessages.entries()) {
        if (streamId.startsWith(`${sessionId}-`)) {
          this.streamMessages.delete(streamId);
        }
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