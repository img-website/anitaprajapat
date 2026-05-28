import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16 renamed "middleware" to "proxy" (same functionality).
// Edge-safe NextAuth instance (no DB) used for admin route protection.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  // The `authorized` callback in authConfig handles allow/deny + redirects.
});

export const config = {
  matcher: ["/admin/:path*"],
};
