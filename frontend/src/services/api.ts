import type { Transaction, PolicyGroup } from "../types2";

const API_URL = 'http://localhost:3038';

export const api = {
  // Transaction endpoints
  async getTransactions(): Promise<Transaction[]> {
    const response = await fetch(`${API_URL}/api/transactions`);
    return response.json();
  },

  async addTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await fetch(`${API_URL}/api/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return response.json();
  },

  async deleteTransaction(id: string): Promise<unknown> {
    const response = await fetch(`${API_URL}/api/transactions/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Policy endpoints
  async getPolicies(): Promise<{ groups: PolicyGroup[] }> {
    const response = await fetch(`${API_URL}/api/policies`);
    return response.json();
  },

  async updatePolicies(policies: { groups: PolicyGroup[] }): Promise<unknown> {
    const response = await fetch(`${API_URL}/api/policies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(policies)
    });
    return response.json();
  },

  // AI endpoints
  async analyzeTransaction(transaction: Transaction): Promise<unknown> {
    const response = await fetch(`${API_URL}/api/analyze-transaction`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(transaction)
    });
    return response.json();
  },

  async reanalyzeTransaction(id: string): Promise<unknown> {
    const response = await fetch(`${API_URL}/api/reanalyze-transaction/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  },

  async getPolicySuggestion(transaction: Transaction | null = null): Promise<unknown> {
    const response = await fetch(`${API_URL}/api/suggest-policy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: transaction ? JSON.stringify({ transaction }) : '{}'
    });
    return response.json();
  },

  async getTransactionPolicySuggestion(
    transactionId: string,
    forceRefresh = false
  ): Promise<{ suggestion?: string; cached?: boolean; timestamp?: string } & Record<string, unknown>> {
    const url = `${API_URL}/api/transactions/${transactionId}/policy-suggestion${forceRefresh ? '?force=true' : ''}`;
    const response = await fetch(url);
    return response.json();
  },

  async parseReceipt(file: File): Promise<Record<string, string | undefined> & { error?: string }> {
    const formData = new FormData();
    formData.append('receipt', file);

    const response = await fetch(`${API_URL}/api/parse-receipt`, {
      method: 'POST',
      body: formData
    });
    return response.json();
  }
};

// WebSocket connection
export class WebSocketClient {
  private ws: WebSocket | null;
  private onMessage: (data: any) => void;

  constructor(onMessage: (data: any) => void) {
    this.ws = null;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket('ws://localhost:3038');
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string);
        if (this.onMessage) {
          this.onMessage(data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected, reconnecting...');
      setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };
  }

  close() {
    if (this.ws) {
      this.ws.close();
    }
  }
}


