const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  status: number;
  validationErrors?: Record<string, string>;

  constructor(message: string, status: number, validationErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.validationErrors = validationErrors;
  }
}

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const credentials = localStorage.getItem('communibid_creds');
  
  const headers = new Headers(options.headers);
  if (credentials) {
    headers.set('Authorization', `Basic ${credentials}`);
  }
  
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Optional: Handle unauthorized globally
      // localStorage.removeItem('communibid_creds');
      // window.location.href = '/login';
    }

    let errorMessage = `Request failed with status ${response.status}`;
    let validationErrors: Record<string, string> | undefined;

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      validationErrors = errorData.validationErrors;
    } catch (e) {
      // If response is not JSON, use default message or try text()
      try {
        const text = await response.text();
        if (text) errorMessage = text;
      } catch (innerE) {}
    }

    throw new ApiError(errorMessage, response.status, validationErrors);
  }

  return response;
}
