import "@/styles/globals.css";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { Toaster } from "../components/ui/toaster";
import chakraTheme from "../styles/chakraTheme";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <ChakraProvider theme={chakraTheme}>
      <SessionProvider session={session}>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
          <Toaster />
        </QueryClientProvider>
      </SessionProvider>
    </ChakraProvider>
  );
}
