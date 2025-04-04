#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000/api';
let sessionId = null;
let streamId = null;

/**
 * Test the Agentforce MCP Streaming API
 */
async function runTests() {
  try {
    console.log('Testing Agentforce MCP Streaming API...');
    
    // Test 1: Get manifest
    console.log('\n1. Getting API manifest...');
    const manifest = await getManifest();
    console.log('Manifest received with', manifest.tools.length, 'tools');
    
    // Test 2: Create session
    console.log('\n2. Creating session...');
    const session = await createSession();
    sessionId = session.result.sessionId;
    console.log('Session created. Session ID:', sessionId);
    
    // Test 3: Send streaming message
    console.log('\n3. Sending streaming message...');
    const streamResponse = await sendMessageStream('Hello, can you help me with a streaming response?');
    streamId = streamResponse.result.streamId;
    console.log('Message sent. Stream ID:', streamId);
    
    // Test 4: Poll for stream messages
    console.log('\n4. Polling for stream messages...');
    await pollStreamMessages();
    
    // Test 5: End session
    console.log('\n5. Ending session...');
    const endResult = await endSession();
    console.log('Session ended:', endResult.result.success);
    
    console.log('\nAll tests completed successfully!');
  } catch (error) {
    console.error('Error during tests:', error.message);
  }
}

/**
 * Get API manifest
 */
async function getManifest() {
  const response = await fetch(`${API_URL}/manifest`);
  return response.json();
}

/**
 * Create session
 */
async function createSession() {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'create_session',
      parameters: {}
    })
  });
  
  return response.json();
}

/**
 * Send streaming message
 */
async function sendMessageStream(message) {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'send_message_stream',
      parameters: {
        sessionId,
        message
      }
    })
  });
  
  return response.json();
}

/**
 * Get stream message
 */
async function getStreamMessage() {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'get_stream_message',
      parameters: {
        streamId
      }
    })
  });
  
  return response.json();
}

/**
 * Poll for stream messages
 */
async function pollStreamMessages() {
  let complete = false;
  let fullMessage = '';
  
  // Set a timeout of 2 minutes
  const timeout = Date.now() + 120000;
  
  while (!complete && Date.now() < timeout) {
    const response = await getStreamMessage();
    
    if (response.status === 'error') {
      console.error('Error getting stream message:', response.error.message);
      return;
    }
    
    const result = response.result;
    
    if (result.type === 'waiting') {
      // No message yet, wait and try again
      await new Promise(resolve => setTimeout(resolve, 500));
      continue;
    } else if (result.type === 'chunk') {
      // Got a chunk, display it
      process.stdout.write(result.data);
      fullMessage += result.data;
    } else if (result.type === 'complete') {
      // Complete message received
      console.log('\n\nComplete message received:', result.data);
      complete = true;
    } else if (result.type === 'error') {
      // Error occurred
      console.error('\nStream error:', result.error);
      complete = true;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  if (!complete) {
    console.log('\n\nTimeout reached, cancelling stream...');
    await cancelStream();
  }
  
  console.log('\nFull message length:', fullMessage.length);
}

/**
 * Cancel stream
 */
async function cancelStream() {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'cancel_stream',
      parameters: {
        streamId
      }
    })
  });
  
  return response.json();
}

/**
 * End session
 */
async function endSession() {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'end_session',
      parameters: {
        sessionId
      }
    })
  });
  
  return response.json();
}

// Run tests
runTests();