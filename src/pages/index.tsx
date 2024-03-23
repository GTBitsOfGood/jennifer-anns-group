import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { SessionProvider } from "next-auth/react";
import React from "react";

const Home = () => {
  return (
    <div>
      <SessionProvider>
        <Header />
        <Footer />
      </SessionProvider>
    </div>
  );
};

export default Home;
