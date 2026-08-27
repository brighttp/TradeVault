import crypto from 'crypto';

export interface OkxCredentials {
  apiKey: string;
  secretKey: string;
  passphrase: string;
}

export class OkxClient {
  // Reverting to www.okx.com since ISP blocks SNI for all OKX domains
  private baseUrl = 'https://www.okx.com';

  constructor(private creds: OkxCredentials) {}

  private generateSignature(timestamp: string, method: string, requestPath: string, body: string = '') {
    const signStr = timestamp + method + requestPath + body;
    return crypto.createHmac('sha256', this.creds.secretKey).update(signStr).digest('base64');
  }

  private async request<T>(method: string, path: string, body?: any): Promise<T> {
    const timestamp = new Date().toISOString();
    const bodyStr = body ? JSON.stringify(body) : '';
    const signature = this.generateSignature(timestamp, method, path, bodyStr);

    const headers: HeadersInit = {
      'OK-ACCESS-KEY': this.creds.apiKey,
      'OK-ACCESS-SIGN': signature,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': this.creds.passphrase,
      'Content-Type': 'application/json',
    };

    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url, {
      method,
      headers,
      body: body ? bodyStr : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OKX API Error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    if (data.code !== '0') {
      throw new Error(`OKX API Error: ${data.msg}`);
    }

    return data.data as T;
  }

  // Fetch Open Positions (All Instrument Types)
  async getOpenPositions() {
    return this.request('GET', '/api/v5/account/positions');
  }

  // Fetch Closed Positions (History for All Instrument Types)
  async getPositionsHistory() {
    return this.request('GET', '/api/v5/account/positions-history');
  }
}
