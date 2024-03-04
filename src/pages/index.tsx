import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { z } from "zod";

const Home = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser, userData?.label]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  return (
    <div>
      <SessionProvider>
        <Header
          label={userData?.label}
          userData={userData}
          setUserData={setUserData}
        />
        <br></br>

        <Footer />
      </SessionProvider>
    </div>
  );
};

export default Home;
