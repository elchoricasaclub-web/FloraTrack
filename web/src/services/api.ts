/**
 * Core API Service Handler - FloraTrack AgTech SaaS Client
 * Provides structured, type-safe fetch requests with standard GACP/GMP authentication headers.
 */

const API_BASE_URL = '/api';

export class ApiServiceError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiServiceError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  
  // Custom tracking ID for ALCOA+ audit logs tracing
  headers.set('X-Auditor-Trace-ID', `TR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`);

  const config: RequestInit = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // Try parsing json body
    let responseData: any;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new ApiServiceError(
        response.status,
        responseData?.error || `Request failed with code ${response.status}`,
        responseData
      );
    }

    return responseData as T;
  } catch (error: any) {
    if (error instanceof ApiServiceError) {
      throw error;
    }
    // Network failures / DNS errors
    throw new Error(error.message || 'Severe connection or server latency error.');
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: any) => request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' })
};
