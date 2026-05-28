"use client";

import { ThemeProvider } from "@/context/ThemeContext";

// Global providers (theme only). NextAuth's SessionProvider is intentionally
// NOT here — the public site has no session UI, so we avoid the constant
// /api/auth/session polling (and its startup ClientFetchError). Admin uses
// server-side `auth()` + signIn/signOut, which don't need the provider.
export default function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
