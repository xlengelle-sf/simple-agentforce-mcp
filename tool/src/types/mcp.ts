/**
 * MCP Protocol Types
 */

export interface MCPConfig {
  serverPort: number;
  toolName: string;
  toolDescription: string;
}

export interface MCPManifest {
  schema_version: string;
  metadata: {
    name: string;
    description: string;
  };
  tools: MCPTool[];
}

export interface MCPTool {
  name: string;
  description: string;
  input_schema: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
    }>;
    required: string[];
  };
  output_schema: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
    }>;
  };
}

export interface MCPRequest {
  tool: string;
  parameters: Record<string, any>;
}

export interface MCPResponse {
  status: 'success' | 'error';
  result?: any;
  error?: {
    type: string;
    message: string;
  };
}

/**
 * Agentforce API Types
 */

export interface AgentforceConfig {
  clientId: string;
  clientSecret: string;
  orgBaseUrl: string;
  agentId: string;
}

export interface AgentforceSession {
  sessionId: string;
  sessionKey: string;
  sequenceId: number;
}

export interface AgentforceMessage {
  sequenceId: number;
  message: string;
  attachments?: any[];
}

export interface AgentforceResponse {
  responseId: string;
  message: string;
}

export interface AgentforceAuthToken {
  access_token: string;
  instance_url: string;
  token_type: string;
  expires_in: number;
}