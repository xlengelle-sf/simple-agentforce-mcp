import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { AgentforceAuthService } from './agentforce-auth';
import { agentforceConfig } from '../config/config';
import { AgentforceSession } from '../types/mcp';

/**
 * Service for managing Agentforce sessions
 */
export class AgentforceSessionService {
  private authService: AgentforceAuthService;
  private sessions: Map<string, AgentforceSession> = new Map();

  constructor() {
    this.authService = AgentforceAuthService.getInstance();
  }

  /**
   * Create a new session
   */
  public async createSession(): Promise<AgentforceSession> {
    try {
      const accessToken = await this.authService.getAccessToken();
      const sessionKey = uuidv4();

      const response = await axios.post(
        `${agentforceConfig.orgBaseUrl}/agent-api/v1/sessions`,
        {
          agentId: agentforceConfig.agentId,
          sessionKey
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const sessionId = response.data.sessionId;
      
      // Create and store session
      const session: AgentforceSession = {
        sessionId,
        sessionKey,
        sequenceId: 0
      };
      
      this.sessions.set(sessionId, session);
      
      return session;
    } catch (error: any) {
      console.error('Error creating Agentforce session:', error.response?.data || error.message);
      throw new Error('Failed to create session with Agentforce');
    }
  }

  /**
   * Get a session by ID
   */
  public getSession(sessionId: string): AgentforceSession | undefined {
    return this.sessions.get(sessionId);
  }

  /**
   * End a session
   */
  public async endSession(sessionId: string): Promise<boolean> {
    try {
      const session = this.sessions.get(sessionId);
      if (!session) {
        return false;
      }

      const accessToken = await this.authService.getAccessToken();

      await axios.delete(
        `${agentforceConfig.orgBaseUrl}/agent-api/v1/sessions/${sessionId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        }
      );

      // Remove session from memory
      this.sessions.delete(sessionId);
      
      return true;
    } catch (error: any) {
      console.error('Error ending Agentforce session:', error.response?.data || error.message);
      throw new Error('Failed to end session with Agentforce');
    }
  }

  /**
   * Increment sequence ID for a session
   */
  public incrementSequenceId(sessionId: string): number {
    const session = this.sessions.get(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }
    
    session.sequenceId += 1;
    return session.sequenceId;
  }
}