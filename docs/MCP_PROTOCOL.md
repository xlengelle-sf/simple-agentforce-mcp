# Model Context Protocol (MCP) Reference

This document provides an overview of the Model Context Protocol (MCP) as implemented in this project.

## What is MCP?

The Model Context Protocol (MCP) is a standardized interface that enables Large Language Models (LLMs) to interact with external services and tools. It provides a consistent way for LLMs to access data and execute functions in external systems.

## Core Concepts

### Tools

In MCP, a "tool" is a capability exposed to the LLM. Each tool has:

- A name
- A description
- An input schema (what parameters it accepts)
- An output schema (what it returns)

### Schemas

Schemas define the structure of data that tools accept and return. They use a subset of JSON Schema and include:

- Property names
- Data types
- Descriptions
- Required fields

### Requests and Responses

MCP defines a standard format for requests and responses:

**Requests**:
```json
{
  "tool": "tool_name",
  "parameters": {
    "param1": "value1",
    "param2": "value2"
  }
}
```

**Responses**:
```json
{
  "status": "success",
  "result": {
    "property1": "value1",
    "property2": "value2"
  }
}
```

or for errors:

```json
{
  "status": "error",
  "error": {
    "type": "ERROR_TYPE",
    "message": "Human-readable error message"
  }
}
```

## MCP Implementation in This Project

### Manifest Endpoint

The `/api/manifest` endpoint returns a manifest describing all available tools:

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
      "input_schema": { ... },
      "output_schema": { ... }
    },
    ...
  ]
}
```

### Execute Endpoint

The `/api/execute` endpoint executes a specified tool with parameters:

**Request**:
```json
{
  "tool": "send_message",
  "parameters": {
    "sessionId": "abc123",
    "message": "Hello, Agentforce!"
  }
}
```

**Response**:
```json
{
  "status": "success",
  "result": {
    "message": "Hi there! How can I help you today?"
  }
}
```

## Integration with Claude Desktop

Claude Desktop uses the MCP protocol to communicate with tools:

1. Claude Desktop requests the tool manifest via the `/api/manifest` endpoint
2. When the user requests to use a tool, Claude Desktop sends a request to `/api/execute`
3. The tool executes the request and returns a response
4. Claude Desktop processes the response and incorporates it into the conversation

## MCP Versioning

This implementation uses MCP schema version `202206`, which includes:

- Basic tool definitions
- JSON Schema for input and output structures
- Standard error formats

## Best Practices for MCP Implementation

1. **Clear Descriptions**: Provide clear descriptions for tools and parameters
2. **Consistent Naming**: Use consistent naming conventions for tools and parameters
3. **Proper Validation**: Validate inputs according to schemas
4. **Helpful Errors**: Return descriptive error messages
5. **Stateless Design**: When possible, design tools to be stateless
6. **Documentation**: Document all tools and their parameters
7. **Rate Limiting**: Implement rate limiting to prevent abuse
8. **Security**: Follow security best practices for web services

## Common MCP Patterns

### Tool Discovery

Claude Desktop uses the manifest endpoint to discover available tools:

```
GET /api/manifest
```

### Tool Execution

Claude Desktop executes tools via the execute endpoint:

```
POST /api/execute
{
  "tool": "tool_name",
  "parameters": { ... }
}
```

### Error Handling

Claude Desktop handles errors based on the status and error fields:

```json
{
  "status": "error",
  "error": {
    "type": "INVALID_PARAMETERS",
    "message": "Missing required parameter 'sessionId'"
  }
}
```

## References

- [Model Context Protocol Specification](https://github.com/modelcontextprotocol/specification)
- [Anthropic Claude Tools Documentation](https://docs.anthropic.com/claude/docs/tools)
- [JSON Schema](https://json-schema.org/)

## Further Reading

- [MCP Python SDK](https://github.com/modelcontextprotocol/python-sdk)
- [FastMCP](https://github.com/jlowin/fastmcp)