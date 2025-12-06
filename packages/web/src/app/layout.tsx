import type { Metadata } from "next";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SWRProvider } from "@/providers/swr-provider";
import { AnonymousSessionProvider } from "@/providers/anonymous-session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coomb - Seu currículo perfeito com IA",
  description: "A IA que transforma seu currículo em destaque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SWRProvider>
          <AnonymousSessionProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </AnonymousSessionProvider>
        </SWRProvider>
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
