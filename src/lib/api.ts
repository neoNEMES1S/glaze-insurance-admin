// API client for communicating with FastAPI backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Token storage
const TOKEN_KEY = 'access_token';
const REFRESH_KEY = 'refresh_token';

export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string): void {
    localStorage.setItem(TOKEN_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
}

export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_KEY);
}

// API error class
export class ApiError extends Error {
    constructor(public status: number, message: string, public detail?: unknown) {
        super(message);
        this.name = 'ApiError';
    }
}

// Fetch wrapper with auth
async function fetchWithAuth(
    path: string,
    options: RequestInit = {}
): Promise<Response> {
    const token = getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers,
    });

    // Handle 401 - try token refresh
    if (response.status === 401 && getRefreshToken()) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
            // Retry with new token
            (headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
            return fetch(`${API_BASE}${path}`, { ...options, headers });
        }
    }

    return response;
}

// Refresh access token
async function refreshAccessToken(): Promise<boolean> {
    const refresh = getRefreshToken();
    if (!refresh) return false;

    try {
        const response = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh_token: refresh }),
        });

        if (response.ok) {
            const data = await response.json();
            setTokens(data.access_token, data.refresh_token);
            return true;
        }
    } catch {
        // Refresh failed
    }

    clearTokens();
    return false;
}

// API methods
export const api = {
    async get<T>(path: string): Promise<T> {
        const res = await fetchWithAuth(path);
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Request failed', error);
        }
        return res.json();
    },

    async post<T>(path: string, body?: unknown): Promise<T> {
        const res = await fetchWithAuth(path, {
            method: 'POST',
            body: body ? JSON.stringify(body) : undefined,
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Request failed', error);
        }
        return res.json();
    },

    async patch<T>(path: string, body: unknown): Promise<T> {
        const res = await fetchWithAuth(path, {
            method: 'PATCH',
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Request failed', error);
        }
        return res.json();
    },

    async delete(path: string): Promise<void> {
        const res = await fetchWithAuth(path, { method: 'DELETE' });
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Request failed', error);
        }
    },
};

// Auth API
export const authApi = {
    async login(email: string, password: string) {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formData,
        });

        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Login failed', error);
        }

        const data = await res.json();
        setTokens(data.access_token, data.refresh_token);
        return data;
    },

    async logout() {
        try {
            await api.post('/api/v1/auth/logout');
        } finally {
            clearTokens();
        }
    },

    async me() {
        return api.get<{
            id: string;
            email: string;
            first_name: string;
            last_name: string;
            role: string;
            tenant_id: string;
        }>('/api/v1/auth/me');
    },
};
