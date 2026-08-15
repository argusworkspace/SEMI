import { apiClient } from "@/lib/api";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../types";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const form = new URLSearchParams();
    form.append("username", data.email);
    form.append("password", data.password);

    const res = await fetch(`${apiClient.baseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form,
    });

    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },

  async register(data: RegisterRequest): Promise<User> {
    return apiClient.post<User>("/auth/register", data);
  },

  async me(token: string): Promise<User> {
    return apiClient.get<User>("/auth/me", token);
  },
};
