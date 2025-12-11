import { authCookie } from "./auth-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type RequestConfig = {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
};

type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  config?: RequestConfig;
};

class ServerApi {
  private async getHeaders(): Promise<HeadersInit> {
    const token = await authCookie.get();

    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { method = "GET", body, config = {} } = options;
    const headers = await this.getHeaders();

    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      cache: config.cache ?? "no-store",
      ...(config.revalidate !== undefined && {
        next: { revalidate: config.revalidate, tags: config.tags },
      }),
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: "Erro desconhecido" }));
      throw new Error(errorData.message || `Erro ${response.status}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { config });
  }

  async post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: "POST", body, config });
  }

  async patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: "PATCH", body, config });
  }

  async put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: "PUT", body, config });
  }

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", config });
  }
}

export const serverApi = new ServerApi();
export { authCookie };
