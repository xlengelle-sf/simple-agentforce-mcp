# Streaming Implementation Guide

This document explains how to use the streaming functionality in the Simple Agentforce MCP implementation.

## Overview

Streaming enables real-time delivery of responses from the Agentforce agent, providing a more interactive experience for users. Instead of waiting for the entire response, streaming delivers the response in chunks as they become available.

## How Streaming Works

The streaming implementation uses a combination of Server-Sent Events (SSE) from Agentforce and a polling mechanism for MCP:

1. The client initiates a streaming session with `send_message_stream`
2. The server connects to Agentforce's streaming endpoint
3. Agentforce sends chunks of the response as SSE events
4. The server parses and buffers these chunks
5. The client polls for chunks using `get_stream_message`
6. The server returns one chunk at a time from the buffer
7. When the response is complete, the server sends a completion event

## Streaming Tools

### 1. send_message_stream

Initiates a streaming session with the Agentforce agent.

**Input:**
```json
{
  "sessionId": "string",
  "message": "string"
}
```

**Output:**
```json
{
  "streamId": "string"
}
```

The `streamId` is used to retrieve message chunks.

### 2. get_stream_message

Retrieves the next message chunk from the stream.

**Input:**
```json
{
  "streamId": "string"
}
```

**Output:**
```json
{
  "type": "chunk | complete | error | waiting",
  "data": "string",
  "error": "string"
}
```

The response types are:
- `chunk`: A partial response chunk
- `complete`: The final chunk indicating the response is complete
- `error`: An error occurred during streaming
- `waiting`: No chunks available yet, try again later

### 3. cancel_stream

Cancels an active streaming session.

**Input:**
```json
{
  "streamId": "string"
}
```

**Output:**
```json
{
  "success": true
}
```

## Streaming Flow Example

Here's a pseudocode example showing the streaming flow:

```javascript
// Create a session
const session = await createSession();
const sessionId = session.result.sessionId;

// Start streaming
const streamResponse = await sendMessageStream(sessionId, "What is Salesforce?");
const streamId = streamResponse.result.streamId;

let fullResponse = "";
let complete = false;

// Poll for chunks until complete
while (!complete) {
  const chunkResponse = await getStreamMessage(streamId);
  const chunk = chunkResponse.result;
  
  if (chunk.type === "waiting") {
    // No chunks yet, wait and try again
    await sleep(100);
    continue;
  }
  
  if (chunk.type === "chunk") {
    // Process chunk
    console.log(chunk.data);
    fullResponse += chunk.data;
  }
  
  if (chunk.type === "complete") {
    // Final chunk received
    complete = true;
    console.log("Final response:", fullResponse);
  }
  
  if (chunk.type === "error") {
    // Handle error
    console.error("Stream error:", chunk.error);
    complete = true;
  }
}
```

## Streaming Implementation Details

### Server-Side

The server-side implementation:

1. Uses EventEmitter for handling async events
2. Parses SSE format from the Agentforce API
3. Maintains a buffer for each active stream
4. Implements cleanup for completed or cancelled streams

### Client-Side

The client (or tool) should:

1. Start a stream with `send_message_stream`
2. Poll for chunks with `get_stream_message`
3. Process each chunk as it arrives
4. Stop polling when a `complete` or `error` chunk is received
5. Clean up by cancelling streams if needed

## Best Practices

1. **Polling Interval**: Use a reasonable polling interval (100-500ms) to reduce server load
2. **Timeout Handling**: Implement a timeout to avoid infinite polling
3. **Error Handling**: Process error chunks and display appropriate messages
4. **Buffering**: Buffer chunks client-side if needed for smoother display

## Limitations

1. **Resource Usage**: Streaming uses more server resources due to active connections
2. **Session Life**: Streaming sessions are bound to the server and will be lost if the server restarts
3. **Scalability**: For high-volume deployments, consider adding a persistent message queue

## Example Test Script

The server includes a test script (`test-streaming.js`) that demonstrates the streaming functionality:

```bash
npm run test:stream
```

This script demonstrates the full streaming flow, including:
- Session creation
- Stream initiation
- Chunk polling
- Stream completion
- Session termination