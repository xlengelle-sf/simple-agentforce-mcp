import axios from 'axios';
import { AgentforceAuthService } from './agentforce-auth';
import { AgentforceSessionService } from './agentforce-session';
import { agentforceConfig } from '../config/config';
import { 
  AgentforceMessage, 
  AgentforceResponse, 
  AgentforceStreamChunk,
  StreamResponseEvent,
  StreamResponseType
} from '../types/mcp';
import { EventEmitter } from 'events';

/**
 * Service for Agentforce messaging
 */
export class AgentforceMessagingService {
  private authService: AgentforceAuthService;
  private sessionService: AgentforceSessionService;
  private streamSessions: Map<string, EventEmitter> = new Map();

  constructor(sessionService: AgentforceSessionService) {
    this.authService = AgentforceAuthService.getInstance();
    this.sessionService = sessionService;
  }

  /**
   * Send message to Agentforce agent
   */
  public async sendMessage(sessionId: string, messageText: string): Promise<AgentforceResponse> {
    try {
      const session = this.sessionService.getSession(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Increment sequence ID
      const sequenceId = this.sessionService.incrementSequenceId(sessionId);
      
      // Get access token
      const accessToken = await this.authService.getAccessToken();
      
      // Prepare message
      const message: AgentforceMessage = {
        sequenceId,
        message: messageText
      };
      
      // Send message
      const response = await axios.post(
        `${agentforceConfig.orgBaseUrl}/services/v1/agent/session/${sessionId}/message`,
        message,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return {
        responseId: response.data.responseId,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error sending message to Agentforce:', error.response?.data || error.message);
      throw new Error('Failed to send message to Agentforce');
    }
  }

  /**
   * Send message to Agentforce agent with streaming response
   */
  public async sendMessageStream(sessionId: string, messageText: string): Promise<EventEmitter> {
    try {
      const session = this.sessionService.getSession(sessionId);
      
      if (!session) {
        throw new Error('Session not found');
      }
      
      // Increment sequence ID
      const sequenceId = this.sessionService.incrementSequenceId(sessionId);
      
      // Get access token
      const accessToken = await this.authService.getAccessToken();
      
      // Prepare message
      const message: AgentforceMessage = {
        sequenceId,
        message: messageText
      };
      
      // Create a new event emitter for this stream
      const streamEmitter = new EventEmitter();
      const streamId = `${sessionId}-${sequenceId}`;
      this.streamSessions.set(streamId, streamEmitter);
      
      // Make streaming request
      const url = `${agentforceConfig.orgBaseUrl}/services/v1/agent/session/${sessionId}/message/stream`;
      
      // Start the streaming request
      axios({
        method: 'post',
        url: url,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        data: message,
        responseType: 'stream'
      })
      .then(response => {
        let buffer = '';
        let fullMessage = '';
        
        response.data.on('data', (chunk: Buffer) => {
          const chunkStr = chunk.toString();
          buffer += chunkStr;
          
          // Process complete SSE events
          if (buffer.includes('\n\n')) {
            const events = buffer.split('\n\n');
            buffer = events.pop() || ''; // Keep the last incomplete chunk
            
            for (const event of events) {
              if (!event.trim()) continue;
              
              try {
                // Parse SSE format
                const lines = event.split('\n');
                const sseEvent: AgentforceStreamChunk = {};
                
                for (const line of lines) {
                  if (!line.trim()) continue;
                  const [key, ...values] = line.split(':');
                  const value = values.join(':').trim();
                  
                  if (key === 'data') {
                    sseEvent.data = value;
                  } else if (key === 'event') {
                    sseEvent.event = value;
                  } else if (key === 'id') {
                    sseEvent.id = value;
                  } else if (key === 'retry') {
                    sseEvent.retry = parseInt(value, 10);
                  }
                }
                
                // Process the event data
                if (sseEvent.data) {
                  try {
                    const parsedData = JSON.parse(sseEvent.data);
                    
                    if (parsedData.type === 'content') {
                      fullMessage += parsedData.content;
                      
                      // Emit chunk event
                      const chunkEvent: StreamResponseEvent = {
                        type: StreamResponseType.CHUNK,
                        data: parsedData.content
                      };
                      streamEmitter.emit('message', chunkEvent);
                    }
                  } catch (e) {
                    // If not JSON, treat as plain text
                    fullMessage += sseEvent.data;
                    
                    // Emit chunk event
                    const chunkEvent: StreamResponseEvent = {
                      type: StreamResponseType.CHUNK,
                      data: sseEvent.data
                    };
                    streamEmitter.emit('message', chunkEvent);
                  }
                }
              } catch (error) {
                console.error('Error processing stream chunk:', error);
                streamEmitter.emit('message', {
                  type: StreamResponseType.ERROR,
                  error: 'Error processing stream chunk'
                });
              }
            }
          }
        });
        
        response.data.on('end', () => {
          // Process any remaining data in buffer
          if (buffer.trim()) {
            try {
              const sseEvent: AgentforceStreamChunk = { data: buffer.trim() };
              
              // Try to parse as JSON
              try {
                const parsedData = JSON.parse(sseEvent.data);
                if (parsedData.type === 'content') {
                  fullMessage += parsedData.content;
                }
              } catch (e) {
                // If not JSON, treat as plain text
                fullMessage += sseEvent.data;
              }
            } catch (error) {
              console.error('Error processing final stream chunk:', error);
            }
          }
          
          // Emit complete event
          const completeEvent: StreamResponseEvent = {
            type: StreamResponseType.COMPLETE,
            data: fullMessage
          };
          streamEmitter.emit('message', completeEvent);
          
          // Clean up
          this.streamSessions.delete(streamId);
        });
        
        response.data.on('error', (error: Error) => {
          console.error('Stream error:', error);
          
          // Emit error event
          const errorEvent: StreamResponseEvent = {
            type: StreamResponseType.ERROR,
            error: error.message
          };
          streamEmitter.emit('message', errorEvent);
          
          // Clean up
          this.streamSessions.delete(streamId);
        });
      })
      .catch(error => {
        console.error('Error establishing stream:', error);
        
        // Emit error event
        const errorEvent: StreamResponseEvent = {
          type: StreamResponseType.ERROR,
          error: error.message || 'Error establishing stream'
        };
        streamEmitter.emit('message', errorEvent);
        
        // Clean up
        this.streamSessions.delete(streamId);
      });
      
      return streamEmitter;
    } catch (error: any) {
      console.error('Error initiating streaming message to Agentforce:', error);
      throw new Error('Failed to initiate streaming message to Agentforce');
    }
  }
  
  /**
   * Cancel an active stream
   */
  public cancelStream(sessionId: string, sequenceId: number): boolean {
    const streamId = `${sessionId}-${sequenceId}`;
    const emitter = this.streamSessions.get(streamId);
    
    if (emitter) {
      // Emit cancel event
      emitter.emit('message', {
        type: StreamResponseType.ERROR,
        error: 'Stream cancelled by user'
      });
      
      // Clean up
      this.streamSessions.delete(streamId);
      return true;
    }
    
    return false;
  }
}