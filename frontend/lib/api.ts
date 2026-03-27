const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

export async function apiCall(
  endpoint: string,
  method = "GET",
  body?: any,
  token?: string,
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API Call Failed (${endpoint}):`, error);
    throw error;
  }
}

export function getToken(): string | undefined {
  if (typeof window === "undefined") return undefined;
  return localStorage.getItem("token") ?? undefined;
}

export function getUser() {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}
