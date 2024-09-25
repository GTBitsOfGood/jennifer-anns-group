import "@/styles/globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "../components/ui/toaster";
import Header from "@/components/Navigation/Header";
import { Footer } from "@/components/Navigation/Footer";
import { useRouter } from "next/router";
import { AnalyticsProvider } from "@/context/AnalyticsContext";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const router = useRouter();
  const showHeaderAndFooter =
    !router.pathname.includes("/login") &&
    !router.pathname.includes("/signup") &&
    !router.pathname.includes("/password-reset") &&
    !router.pathname.includes("/raw");

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
