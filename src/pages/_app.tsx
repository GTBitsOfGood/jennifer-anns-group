import "@/styles/globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster";
import Header from "@/components/Navigation/Header";
import { Footer } from "@/components/Navigation/Footer";
import { usePathname, useRouter } from "next/navigation";
import { AnalyticsProvider } from "@/context/AnalyticsContext";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const pathname = usePathname();
  let showHeaderAndFooter = false;
  if (pathname) {
    showHeaderAndFooter =
      !pathname.includes("/login") &&
      !pathname.includes("/signup") &&
      !pathname.includes("/password-reset") &&
      !pathname.includes("/raw");
  }

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AnalyticsProvider>
          {showHeaderAndFooter && <Header />}
          <Component {...pageProps} />
          <Toaster />
          {showHeaderAndFooter && <Footer />}
        </AnalyticsProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
