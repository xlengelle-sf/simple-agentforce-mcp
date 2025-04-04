# Troubleshooting Guide

This guide addresses common issues you might encounter when using the Simple Agentforce MCP integration.

## Server Issues

### Server Won't Start

**Symptoms:**
- Error messages when starting the server
- Port already in use errors

**Solutions:**
1. Check if another process is using the configured port:
   ```bash
   lsof -i :3000
   ```
2. Verify the required environment variables are set correctly in `.env`
3. Check Node.js version (should be 14.x or higher)
4. Try running with verbose logging:
   ```bash
   DEBUG=* npm start
   ```

### Authentication Failures

**Symptoms:**
- "Failed to authenticate with Agentforce" error message
- 401 Unauthorized errors in logs

**Solutions:**
1. Verify your Client ID and Client Secret are correct
2. Ensure your Connected App has the right OAuth scopes:
   - "Access chatbot services (chatbot_api)"
   - "Access the Salesforce API Platform (sfap_api)"
   - "Manage user data via APIs (api)"
   - "Perform requests at any time"
3. Check your Salesforce org URL is correct and accessible
4. Verify your Connected App is properly set up in Salesforce
5. Check if your Connected App IP restrictions might be blocking the server

### Session Creation Errors

**Symptoms:**
- "Failed to create session with Agentforce" error message
- Session creation API calls failing

**Solutions:**
1. Verify your Agent ID is correct
2. Ensure the agent is active in your Salesforce environment
3. Check that your user has permission to access the agent
4. Verify your OAuth token has the right scopes
5. Check Salesforce logs for specific error messages

## Tool Issues

### Tool Won't Start

**Symptoms:**
- Error messages when starting the tool
- Port already in use errors

**Solutions:**
1. Check if another process is using the configured port:
   ```bash
   lsof -i :3001
   ```
2. Verify the server URL is correct in `.env`
3. Try running with verbose logging:
   ```bash
   DEBUG=* npm start
   ```

### Tool Can't Connect to Server

**Symptoms:**
- Connection refused errors
- Timeout errors

**Solutions:**
1. Ensure the server is running
2. Verify the server URL in tool's `.env` file
3. Check network connectivity between tool and server
4. If running in Docker or across networks, ensure proper network routing

## Claude Desktop Integration Issues

### Tool Not Showing in Claude Desktop

**Symptoms:**
- Tool does not appear in Claude Desktop
- "Tool not available" messages

**Solutions:**
1. Verify the tool is running
2. Check the tool URL configured in Claude Desktop
3. Ensure the tool is accessible from Claude Desktop's network
4. Try restarting Claude Desktop

### Claude Cannot Execute Tool Operations

**Symptoms:**
- "Failed to execute tool" messages
- Timeout errors when using the tool

**Solutions:**
1. Verify both server and tool are running
2. Check the tool URL in Claude Desktop settings
3. Ensure your network allows requests from Claude Desktop to your tool
4. Check server logs for specific error messages
5. Try increasing timeouts in the tool configuration

## Agentforce API Issues

### Messages Not Being Delivered

**Symptoms:**
- Agent does not respond to messages
- Empty or null responses from agent

**Solutions:**
1. Verify the agent is active and properly configured
2. Check session sequence IDs are being properly incremented
3. Ensure messages are properly formatted
4. Check Salesforce logs for specific error messages related to your agent

### Unexpected Agent Responses

**Symptoms:**
- Agent responses seem unrelated to the query
- Agent responds with error messages

**Solutions:**
1. Verify the agent is properly trained for the types of queries you're sending
2. Check if the agent has access to the necessary data sources
3. Ensure the session is maintaining proper context
4. Try simplifying complex queries into smaller steps

## Common Error Messages

### "Missing AGENTFORCE_CLIENT_ID in environment variables"

**Solution:** Add your Salesforce Connected App Client ID to `.env` file.

### "Failed to authenticate with Agentforce"

**Solution:** Verify your Client ID, Client Secret, and Org URL.

### "Failed to create session with Agentforce"

**Solution:** Verify your Agent ID and ensure the agent is active.

### "Session not found"

**Solution:** The session may have expired. Create a new session.

### "ECONNREFUSED when connecting to Salesforce"

**Solution:** Check your Org URL and network connectivity.

## Logging and Debugging

For more detailed debugging:

1. Set the DEBUG environment variable:
   ```bash
   DEBUG=simple-agentforce:* npm start
   ```

2. Check server logs for API request/response details:
   ```bash
   # For server
   cd server
   DEBUG=* npm start > server.log 2>&1
   
   # For tool
   cd tool
   DEBUG=* npm start > tool.log 2>&1
   ```

3. Use the test script with verbose logging:
   ```bash
   DEBUG=* npm test
   ```

## Getting Additional Help

If you're still experiencing issues:

1. Check the GitHub repository for open and closed issues
2. Submit a detailed bug report including:
   - Server and tool logs
   - Environment details (OS, Node.js version)
   - Steps to reproduce the issue
   - Any error messages or unexpected behavior
3. Join the community forum or discussion group