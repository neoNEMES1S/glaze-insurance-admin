// API client for communicating with FastAPI backend

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Demo mode — when true, all API calls return mock data without hitting the backend
const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true';

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

// ── Demo mock data for all API routes ──
const DEMO_MOCK_DATA: Record<string, unknown> = {
    '/api/v1/dashboard/stats': {
        total_tenants: 12,
        total_employees: 2847,
        pending_enrollments: 143,
        approved_enrollments: 2584,
        enrollment_rate: 90.8,
    },
    '/api/v1/auth/me': {
        id: 'demo-001',
        email: 'broker@demo.com',
        first_name: 'Sarah',
        last_name: '',
        role: 'broker',
        tenant_id: 'demo-tenant',
    },
    '/api/v1/tenants': [],
    '/api/v1/employees': [],
    '/api/v1/enrollments': [],
    '/api/v1/tpa-forms': [],
    '/api/v1/analytics': {},
    '/api/v1/wellness': {},
};

function getDemoData<T>(path: string): T {
    // Try exact match first, then prefix match
    if (DEMO_MOCK_DATA[path] !== undefined) return DEMO_MOCK_DATA[path] as T;
    const match = Object.keys(DEMO_MOCK_DATA).find((key) => path.startsWith(key));
    return (match ? DEMO_MOCK_DATA[match] : {}) as T;
}

// API methods
export const api = {
    async get<T>(path: string): Promise<T> {
        if (DEMO_MODE) return getDemoData<T>(path);

        const res = await fetchWithAuth(path);
        if (!res.ok) {
            const error = await res.json().catch(() => ({}));
            throw new ApiError(res.status, error.detail || 'Request failed', error);
        }
        return res.json();
    },

    async post<T>(path: string, body?: unknown): Promise<T> {
        if (DEMO_MODE) return getDemoData<T>(path);

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
        if (DEMO_MODE) return getDemoData<T>(path);

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
        if (DEMO_MODE) return;

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
        if (DEMO_MODE) {
            const mockTokens = { access_token: 'demo-access', refresh_token: 'demo-refresh' };
            setTokens(mockTokens.access_token, mockTokens.refresh_token);
            return mockTokens;
        }

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
        if (DEMO_MODE) {
            clearTokens();
            return;
        }

        try {
            await api.post('/api/v1/auth/logout');
        } finally {
            clearTokens();
        }
    },

    async me() {
        if (DEMO_MODE) {
            return getDemoData<{
                id: string;
                email: string;
                first_name: string;
                last_name: string;
                role: string;
                tenant_id: string;
            }>('/api/v1/auth/me');
        }

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

