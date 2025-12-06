import type { User } from "@/entities";
import { api } from "@/lib/api";
import type { LoginRequest, RegisterRequest } from "@/schemas/auth.schema";

interface AuthResponse {
  access_token: string;
  user: User;
}

const baseURL = "/api/v1/auth";

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${baseURL}/login`, data);
    return response.data;
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(`${baseURL}/register`, data);
    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>(`${baseURL}/me`);
    return response.data;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  },
};
