import { Footer } from "@/components/Header/Footer";
import Header from "@/components/Header/Header";
import { UserType } from "@/utils/types/userTypes";
import React from "react";

const Home = () => {
  return (
    <div>
      <Header user={UserType.Public} />
      <Header user={UserType.AccountHolder} />
      <Header user={UserType.Admin} />
      <br></br>
      <Footer />
    </div>
  );
};

export default Home;
