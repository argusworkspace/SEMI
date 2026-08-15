import { env } from "./env";

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...fetchOptions } = options;

  const res = await fetch(`${env.apiUrl}${path}`, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...fetchOptions.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(error.detail ?? "Request failed");
  }

  return res.json();
}

export const apiClient = {
  baseUrl: env.apiUrl,

  get<T>(path: string, token?: string) {
    return request<T>(path, { method: "GET", token });
  },

  post<T>(path: string, body: unknown, token?: string) {
    return request<T>(path, {
      method: "POST",
      body: JSON.stringify(body),
      token,
    });
  },

  put<T>(path: string, body: unknown, token?: string) {
    return request<T>(path, {
      method: "PUT",
      body: JSON.stringify(body),
      token,
    });
  },

  delete<T>(path: string, token?: string) {
    return request<T>(path, { method: "DELETE", token });
  },
};
