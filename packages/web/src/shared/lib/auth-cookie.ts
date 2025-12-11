import { cookies } from "next/headers";

export class AuthCookieManager {
  private readonly cookieName = "token";
  private readonly maxAge = 60 * 60 * 24;

  async set(token: string): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.set(this.cookieName, token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: this.maxAge,
      path: "/",
    });
  }

  async delete(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(this.cookieName);
  }

  async get(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(this.cookieName)?.value;
  }
}

export const authCookie = new AuthCookieManager();
