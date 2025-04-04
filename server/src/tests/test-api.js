#!/usr/bin/env node

const fetch = require('node-fetch');

// Configuration
const API_URL = 'http://localhost:3000/api';
let sessionId = null;

/**
 * Test the Agentforce MCP API
 */
async function runTests() {
  try {
    console.log('Testing Agentforce MCP API...');
    
    // Test 1: Get manifest
    console.log('\n1. Getting API manifest...');
    const manifest = await getManifest();
    console.log('Manifest received:', JSON.stringify(manifest, null, 2));
    
    // Test 2: Create session
    console.log('\n2. Creating session...');
    const session = await createSession();
    sessionId = session.result.sessionId;
    console.log('Session created. Session ID:', sessionId);
    
    // Test 3: Send message
    console.log('\n3. Sending message...');
    const messageResponse = await sendMessage('Hello, how can you help me?');
    console.log('Message response:', messageResponse.result.message);
    
    // Test 4: End session
    console.log('\n4. Ending session...');
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
 * Send message
 */
async function sendMessage(message) {
  const response = await fetch(`${API_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      tool: 'send_message',
      parameters: {
        sessionId,
        message
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