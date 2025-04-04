# API Reference

This document provides a comprehensive reference for the Simple Agentforce MCP API.

## MCP Protocol Overview

The MCP (Model Context Protocol) allows LLMs like Claude to interact with external tools. This implementation provides a simple interface for connecting Claude Desktop with Salesforce Agentforce agents.

## Endpoints

The MCP server exposes two main endpoints:

### GET /api/manifest

Returns the manifest describing the available tools and their schemas.

**Example Response:**
```json
{
  "schema_version": "202206",
  "metadata": {
    "name": "agentforce",
    "description": "Integrate with Salesforce Agentforce agents"
  },
  "tools": [
    {
      "name": "create_session",
      "description": "Create a new session with Agentforce agent",
      "input_schema": {
        "type": "object",
        "properties": {},
        "required": []
      },
      "output_schema": {
        "type": "object",
        "properties": {
          "sessionId": {
            "type": "string",
            "description": "The session ID to use for subsequent requests"
          }
        }
      }
    },
    {
      "name": "send_message",
      "description": "Send a message to the Agentforce agent",
      "input_schema": {
        "type": "object",
        "properties": {
          "sessionId": {
            "type": "string",
            "description": "The session ID from create_session"
          },
          "message": {
            "type": "string",
            "description": "The message to send to the agent"
          }
        },
        "required": ["sessionId", "message"]
      },
      "output_schema": {
        "type": "object",
        "properties": {
          "message": {
            "type": "string",
            "description": "The agent response message"
          }
        }
      }
    },
    {
      "name": "end_session",
      "description": "End the session with the Agentforce agent",
      "input_schema": {
        "type": "object",
        "properties": {
          "sessionId": {
            "type": "string",
            "description": "The session ID to end"
          }
        },
        "required": ["sessionId"]
      },
      "output_schema": {
        "type": "object",
        "properties": {
          "success": {
            "type": "boolean",
            "description": "Whether the session was ended successfully"
          }
        }
      }
    }
  ]
}
```

### POST /api/execute

Executes a tool operation.

**Request Body:**
```json
{
  "tool": "string",
  "parameters": {}
}
```

**Response Body:**
```json
{
  "status": "success | error",
  "result": {},
  "error": {
    "type": "string",
    "message": "string"
  }
}
```

## Tools Reference

### create_session

Creates a new session with the Agentforce agent.

**Input Parameters:** None

**Output:**
```json
{
  "status": "success",
  "result": {
    "sessionId": "string"
  }
}
```

**Error Types:**
- `SESSION_ERROR`: Failed to create a session with Agentforce

### send_message

Sends a message to the Agentforce agent.

**Input Parameters:**
```json
{
  "sessionId": "string",
  "message": "string"
}
```

**Output:**
```json
{
  "status": "success",
  "result": {
    "message": "string"
  }
}
```

**Error Types:**
- `INVALID_PARAMETERS`: Missing required parameters
- `MESSAGE_ERROR`: Failed to send a message to Agentforce
- `SESSION_ERROR`: Session not found or invalid

### end_session

Ends the session with the Agentforce agent.

**Input Parameters:**
```json
{
  "sessionId": "string"
}
```

**Output:**
```json
{
  "status": "success",
  "result": {
    "success": true
  }
}
```

**Error Types:**
- `INVALID_PARAMETERS`: Missing sessionId parameter
- `SESSION_ERROR`: Failed to end session with Agentforce

## Error Handling

The API uses a consistent error format:

```json
{
  "status": "error",
  "error": {
    "type": "ERROR_TYPE",
    "message": "Human-readable error message"
  }
}
```

Common error types include:

| Error Type | Description |
|------------|-------------|
| `INVALID_TOOL` | The specified tool does not exist |
| `INVALID_PARAMETERS` | Missing or invalid parameters |
| `SESSION_ERROR` | Error related to session management |
| `MESSAGE_ERROR` | Error related to message sending |
| `EXECUTION_ERROR` | Generic execution error |

## Agentforce API Integration

Under the hood, this MCP implementation integrates with the Salesforce Agentforce API:

1. **Authentication**: Uses OAuth 2.0 client credentials flow
2. **Session Management**: Creates and manages sessions with Agentforce
3. **Message Sequencing**: Maintains proper message sequence IDs for conversation flow
4. **Response Handling**: Processes and formats agent responses

## Rate Limiting and Performance

The MCP server does not implement its own rate limiting, but it's subject to:

1. Salesforce API limits and quotas
2. Agentforce agent capacity and throughput

For high-volume applications, consider implementing additional rate limiting or queuing mechanisms.