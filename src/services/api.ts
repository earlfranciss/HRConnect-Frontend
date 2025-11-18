const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

interface HttpOptions extends RequestInit {
  headers?: Record<string, string>;
}

function getCookie(name: string) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}

async function http<T = any>(path: string, options: HttpOptions = {}): Promise<T | null> {
  const token = getCookie("auth_token");

  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    credentials: 'include',
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
      (errorBody && (errorBody as any).message) ||
      (typeof errorBody === "string" ? errorBody : null) ||
      "API Error";

    const error = new Error(errorMessage) as any;
    error.status = res.status;
    error.statusText = res.statusText;
    error.body = errorBody;
    throw error;
  }

  return res.status === 204 ? ({} as T) : res.json();
}



export const api = {
  // --- Auth ---
  login: (credentials: { email: string; password: string }) =>
    http("/v1/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  logout: async () =>
    http("/v1/auth/logout", {
      method: "POST",
    })
  ,
  validate: () =>
    http<{ email: string }>("/v1/auth/me", { method: "GET" }),

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
  updateEmergencyLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/emergency-leave", { method: "PUT", body: JSON.stringify(data) }),
  createEmergencyLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/emergency-leave", { method: "POST", body: JSON.stringify(data) }),

  // --- Vacation Leave ---
  getVacationLeave: () =>
    http("/v1/vacation-leave/balance"),
  getVacationHistory: () =>
    http("/v1/vacation-leave/history"),
  updateVacationLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/vacation-leave", { method: "PUT", body: JSON.stringify(data) }),
  createVacationLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/vacation-leave", { method: "POST", body: JSON.stringify(data) }),

  // --- Sick Leave ---
  getSickLeave: () =>
    http("/v1/sick-leave/balance"),
  getSickHistory: () =>
    http("/v1/sick-leave/history"),
  updateSickLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/sick-leave", { method: "PUT", body: JSON.stringify(data) }),
  createSickLeave: (data: { used_days: number , reason: string }) =>
    http("/v1/sick-leave", { method: "POST", body: JSON.stringify(data) }),
};
