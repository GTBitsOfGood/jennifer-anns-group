import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import chakraTheme from "@/styles/chakraTheme";
import { ThemeProvider } from "@mui/material";
import muiTheme from "@/styles/muiTheme";

const queryClient = new QueryClient();

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={chakraTheme}>
          <ThemeProvider theme={muiTheme}>
            <Component {...pageProps} />
          </ThemeProvider>
        </ChakraProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
