const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface HttpOptions extends RequestInit {
  headers?: Record<string, string>;
}

// ✅ Get token from localStorage
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const token = localStorage.getItem('auth_token');
    return token;
  } catch (e) {
    console.warn('Could not access localStorage:', e);
    return null;
  }
}

// ✅ Set token in localStorage
function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('auth_token', token);
  } catch (e) {
    console.error('Could not save token to localStorage:', e);
  }
}

// ✅ Clear token from localStorage
function clearToken(): void {
  if (typeof window === 'undefined') return;
    
  try {
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
  } catch (e) {
    console.warn('Could not clear storage:', e);
  }
}

async function http<T = any>(path: string, options: HttpOptions = {}): Promise<T | null> {
  // ✅ Get fresh token for every request
  const token = getToken();

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    cache: 'no-store',
    ...options,
  });

  const resClone = res.clone();

  if (!res.ok) {
    let errorBody;
    try {
      errorBody = await res.json();
    } catch {
      try {
        errorBody = await resClone.text();
      } catch {
        errorBody = null;
      }
    }

    const errorMessage =
      (errorBody && (errorBody as any).detail) ||
      (errorBody && (errorBody as any).message) ||
      (typeof errorBody === "string" ? errorBody : null) ||
      "API Error";

    const error = new Error(errorMessage) as any;
    error.status = res.status;
    error.statusText = res.statusText;
    error.body = errorBody;

    // ✅ Auto-clear token on 401 Unauthorized
    if (res.status === 401) {
      console.error('❌ 401 Unauthorized - Clearing token');
      clearToken();
    }

    throw error;
  }

  return res.status === 204 ? ({} as T) : res.json();
}

export const api = {
  // --- Auth ---
  login: async (credentials: { email: string; password: string }) => {
    try {
      const result = await http("/v1/auth/login", { 
        method: "POST", 
        body: JSON.stringify(credentials) 
      });
      
      if (result?.access_token) {
        // ✅ Save token to localStorage
        setToken(result.access_token);
      }
      
      return result;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const result = await http("/v1/auth/logout", {
        method: "POST",
      });
      
      clearToken();
      
      return result;
    } catch (error) {
      console.error('❌ Logout failed, but clearing token anyway');
      clearToken();
      throw error;
    }
  },

  register: (credentials: { email: string; password: string }) =>
    http("/v1/auth/register", { method: "POST", body: JSON.stringify(credentials) }),

  validate: async () => {
    const token = getToken();
    
    if (!token) {
      console.log('❌ No token found for validation');
      throw { status: 401, body: { detail: 'No token' } };
    }
    
    try {
      const result = await http<{ email: string; user_id: number }>("/v1/auth/me", { 
        method: "GET" 
      });
      
      return result;
    } catch (error) {
      console.error('❌ Validation failed:', error);
      throw error;
    }
  },

  // --- Chatbot ---
  query: (question: string, conversation_id?: number) =>
    http("/v1/chatbot/query", {
      method: "POST",
      body: JSON.stringify({ question, conversation_id: conversation_id ?? 0 })
    }),
  history: () =>
    http("/v1/chatbot/history"),
  getConversation: (conversation_id: number) =>
    http(`/v1/chatbot/history/${conversation_id}`),
  deleteConversation: (conversation_id: number) =>
    http(`/v1/chatbot/history/${conversation_id}`, { method: "DELETE" }),

  // --- Emergency Leave ---
  getEmergencyLeave: () =>
    http("/v1/emergency-leave/balance"),
  getEmergencyHistory: () =>
    http("/v1/emergency-leave/history"),
  updateEmergencyLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/emergency-leave", { method: "PUT", body: JSON.stringify(data) }),
  createEmergencyLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/emergency-leave", { method: "POST", body: JSON.stringify(data) }),

  // --- Vacation Leave ---
  getVacationLeave: () =>
    http("/v1/vacation-leave/balance"),
  getVacationHistory: () =>
    http("/v1/vacation-leave/history"),
  updateVacationLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/vacation-leave", { method: "PUT", body: JSON.stringify(data) }),
  createVacationLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/vacation-leave", { method: "POST", body: JSON.stringify(data) }),

  // --- Sick Leave ---
  getSickLeave: () =>
    http("/v1/sick-leave/balance"),
  getSickHistory: () =>
    http("/v1/sick-leave/history"),
  updateSickLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/sick-leave", { method: "PUT", body: JSON.stringify(data) }),
  createSickLeave: (data: { used_days: number, reason: string }) =>
    http("/v1/sick-leave", { method: "POST", body: JSON.stringify(data) }),
};