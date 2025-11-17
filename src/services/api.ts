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

  logout: async () => {
    return http("/v1/auth/logout", {
      method: "POST",
    });
  },

  validate: () => 
    http<{ email: string }>("/v1/auth/me", { method: "GET" }),

};
