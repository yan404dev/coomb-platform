export interface OAuthUser {
  email: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  provider: "google" | "facebook" | "linkedin";
  providerId: string;
}
