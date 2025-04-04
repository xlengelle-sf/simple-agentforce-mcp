# Architecture Overview

This document explains the architecture of the Simple Agentforce MCP implementation.

## High-Level Architecture

The system consists of two main components:

1. **MCP Server**: Handles communication with Salesforce Agentforce API
2. **MCP Tool**: Integrates with Claude Desktop and proxies requests to the server

Here's a visual representation of the architecture:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │     │                 │
│ Claude Desktop │────▶│   MCP Tool      │────▶│   MCP Server    │────▶│ Salesforce      │
│                 │     │                 │     │                 │     │ Agentforce API  │
│                 │◀────│                 │◀────│                 │◀────│                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Component Details

### MCP Server

The server implements the Model Context Protocol (MCP) and communicates with the Salesforce Agentforce API.

#### Key Components:

1. **Express Application**: Handles HTTP requests and responses
2. **MCP Controller**: Implements MCP protocol endpoints
3. **Agentforce Services**:
   - **Auth Service**: Manages OAuth authentication with Salesforce
   - **Session Service**: Creates and manages agent sessions
   - **Messaging Service**: Handles message exchange with proper sequencing
4. **Configuration**: Manages environment variables and validation

#### Data Flow:

1. Tool makes request to server
2. Server validates request
3. Server authenticates with Salesforce (if needed)
4. Server communicates with Agentforce API
5. Server processes response and returns to tool

### MCP Tool

The tool serves as a bridge between Claude Desktop and the MCP Server.

#### Key Components:

1. **Express Application**: Handles HTTP requests and responses
2. **Proxy Logic**: Forwards requests to MCP Server
3. **Configuration**: Manages environment variables and validation

#### Data Flow:

1. Claude Desktop makes request to tool
2. Tool validates and forwards request to server
3. Tool receives response from server
4. Tool returns response to Claude Desktop

## Authentication Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│             │     │             │     │                     │
│ MCP Server  │────▶│ OAuth 2.0   │────▶│ Salesforce OAuth    │
│             │     │ Client Flow │     │ Token Endpoint      │
│             │◀────│             │◀────│                     │
└─────────────┘     └─────────────┘     └─────────────────────┘
       │                                           │
       │                                           │
       │                                           ▼
       │                                  ┌─────────────────────┐
       │                                  │                     │
       │                                  │ Access Token        │
       │                                  │                     │
       │                                  └─────────────────────┘
       │                                           │
       ▼                                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Authenticated API Requests                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Session Management

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│             │     │             │     │                     │
│ MCP Server  │────▶│ Create      │────▶│ Agentforce          │
│             │     │ Session     │     │ Sessions API        │
│             │◀────│             │◀────│                     │
└─────────────┘     └─────────────┘     └─────────────────────┘
       │                                           │
       │                                           │
       │                                           ▼
       │                                  ┌─────────────────────┐
       │                                  │                     │
       │                                  │ Session ID &        │
       │                                  │ Session Key         │
       │                                  │                     │
       │                                  └─────────────────────┘
       │                                           │
       ▼                                           ▼
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│              Session-based Message Exchange                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Message Exchange

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐
│             │     │             │     │                     │
│ Claude      │────▶│ MCP Tool    │────▶│ MCP Server          │
│ Desktop     │     │             │     │                     │
│             │◀────│             │◀────│                     │
└─────────────┘     └─────────────┘     └─────────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────────┐
                                         │                     │
                                         │ Increment           │
                                         │ Sequence ID         │
                                         │                     │
                                         └─────────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────────┐
                                         │                     │
                                         │ Send Message to     │
                                         │ Agentforce API      │
                                         │                     │
                                         └─────────────────────┘
                                                  │
                                                  ▼
                                         ┌─────────────────────┐
                                         │                     │
                                         │ Process Response    │
                                         │                     │
                                         └─────────────────────┘
```

## Key Design Decisions

### 1. Stateful Session Management

The server maintains session state in memory, tracking:
- Session IDs
- Session keys
- Sequence IDs for messages

This approach simplifies the client interface but makes the server stateful. For production deployments, consider using a persistent storage solution.

### 2. OAuth Token Caching

The OAuth tokens are cached in memory with automatic refresh handling to:
- Reduce authentication overhead
- Avoid hitting Salesforce API limits
- Improve response times

### 3. Synchronous vs. Streaming

This implementation uses the synchronous messaging endpoint for simplicity. A future enhancement could support the streaming endpoint for real-time responses.

### 4. Tool as Proxy

The MCP tool acts as a simple proxy rather than implementing its own logic. This approach:
- Simplifies the architecture
- Reduces code duplication
- Makes maintenance easier

### 5. Type Safety

TypeScript is used throughout to ensure type safety and improve code quality.

## Security Considerations

1. **Environment Variables**: Credentials are stored as environment variables, not in code
2. **CORS**: The server implements CORS protection
3. **Token Management**: OAuth tokens are stored in memory, not persisted
4. **No Credential Logging**: Credentials are not logged in server output

## Scalability Considerations

The current implementation is designed for simplicity and ease of use, with limited scalability features. For higher scale deployments, consider:

1. **Persistent Session Storage**: Use Redis or another storage solution
2. **Load Balancing**: Deploy multiple server instances behind a load balancer
3. **Rate Limiting**: Implement rate limiting to respect Salesforce API limits
4. **Logging & Monitoring**: Add comprehensive logging and monitoring
5. **Health Checks**: Implement detailed health checks for orchestration platforms

## Future Enhancements

1. **Streaming Support**: Add support for Agentforce streaming API
2. **Attachment Handling**: Support for file attachments in messages
3. **User Management**: Support for user-specific configurations
4. **Session Sharing**: Support for sharing sessions across multiple tools
5. **Metrics & Analytics**: Collect usage metrics and performance data