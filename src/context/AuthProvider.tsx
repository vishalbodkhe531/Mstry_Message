"use client";

import { SessionProvider } from "next-auth/react";

// import { Provider } from "next-auth/client";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
