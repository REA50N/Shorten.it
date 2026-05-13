"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import AuthSessionProvider from "./SessionProvider";
import { LandingHeader } from "./landing/header";
import { LandingFooter } from "./landing/footer";

export function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [queryClient] = React.useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
      },
    },
  }));

  return (
    <AuthSessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
          // This helps suppress hydration issues
          storageKey="theme"
        >
          <LandingHeader/>
          {children}
          <LandingFooter/>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </AuthSessionProvider>
  );
}