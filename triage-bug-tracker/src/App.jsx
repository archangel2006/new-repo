"use client";

import { Suspense, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { usePathname } from "@/lib/router-compat";
import Auth from "@/screens/Auth";
import Index from "@/screens/Index";
import Dashboard from "@/screens/Dashboard";
import BugCreate from "@/screens/BugCreate";
import BugDetail from "@/screens/BugDetail";
import BugList from "@/screens/BugList";
import Analytics from "@/screens/Analytics";
import Settings from "@/screens/Settings";
import McpSetup from "@/screens/McpSetup";
import NotFound from "@/screens/NotFound";
import OAuthConsent from "@/screens/OAuthConsent";

function RouteContent() {
  const pathname = usePathname();

  if (pathname === "/auth") return <Auth />;
  if (pathname === "/") return <Index />;
  if (pathname === "/.lovable/oauth/consent") return <OAuthConsent />;

  const protectedPages = {
    "/dashboard": <Dashboard />,
    "/bugs": <BugList />,
    "/bugs/new": <BugCreate />,
    "/analytics": <Analytics />,
    "/settings": <Settings />,
    "/mcp-setup": <McpSetup />,
  };
  if (protectedPages[pathname]) {
    return <ProtectedRoute>{protectedPages[pathname]}</ProtectedRoute>;
  }
  if (/^\/bugs\/[^/]+$/.test(pathname)) {
    return <ProtectedRoute><BugDetail /></ProtectedRoute>;
  }
  return <NotFound />;
}

export default function App() {
  const [queryClient] = useState(() => new QueryClient());
  const supabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!supabaseConfigured) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <section className="w-full max-w-lg space-y-3 border border-border p-6">
          <h1 className="text-base font-medium">Connect the existing Supabase project</h1>
          <p className="text-sm text-muted-foreground">
            Copy <code>.env.example</code> to <code>.env.local</code> and set the project URL and
            publishable (or anon) key. Restart the Next.js dev server to load them.
          </p>
        </section>
      </main>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AuthProvider>
            <Suspense fallback={null}>
              <RouteContent />
            </Suspense>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
