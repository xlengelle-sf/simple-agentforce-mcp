import axios from 'axios';
import { AgentforceAuthService } from './agentforce-auth';
import { AgentforceSessionService } from './agentforce-session';
import { agentforceConfig } from '../config/config';
import { AgentforceMessage, AgentforceResponse } from '../types/mcp';

/**
 * Service for Agentforce messaging
 */
export class AgentforceMessagingService {
  private authService: AgentforceAuthService;
  private sessionService: AgentforceSessionService;

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
}