import axios from 'axios';
import { agentforceConfig } from '../config/config';
import { AgentforceAuthToken } from '../types/mcp';

/**
 * Service for Salesforce Agentforce authentication
 */
export class AgentforceAuthService {
  private static instance: AgentforceAuthService;
  private token: AgentforceAuthToken | null = null;
  private tokenExpiryTime: number = 0;

  private constructor() {}

  /**
   * Get singleton instance
   */
  public static getInstance(): AgentforceAuthService {
    if (!AgentforceAuthService.instance) {
      AgentforceAuthService.instance = new AgentforceAuthService();
    }
    return AgentforceAuthService.instance;
  }

  /**
   * Get valid access token
   */
  public async getAccessToken(): Promise<string> {
    // Check if token exists and is still valid (with 5 min buffer)
    const currentTime = Math.floor(Date.now() / 1000);
    if (this.token && this.tokenExpiryTime > currentTime + 300) {
      return this.token.access_token;
    }

    // Get new token
    return this.refreshToken();
  }

  /**
   * Refresh the access token
   */
  private async refreshToken(): Promise<string> {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', agentforceConfig.clientId);
      params.append('client_secret', agentforceConfig.clientSecret);

      const response = await axios.post<AgentforceAuthToken>(
        `${agentforceConfig.orgBaseUrl}/services/oauth2/token`,
        params,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.token = response.data;
      
      // Calculate token expiry time
      const currentTime = Math.floor(Date.now() / 1000);
      this.tokenExpiryTime = currentTime + response.data.expires_in;
      
      return response.data.access_token;
    } catch (error: any) {
      console.error('Error refreshing Agentforce token:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with Agentforce');
    }
  }
}