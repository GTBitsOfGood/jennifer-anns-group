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
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-center py-32">
            <h1 className="font-rubik text-stone-primary mb-12 text-7xl font-extrabold">
              Jennifer Ann's Group
            </h1>
            <h2 className="text-5xl font-medium italic text-orange-primary">
              Gaming against violence.
            </h2>
          </div>
          <div className="bg-blue-bg flex w-full flex-col items-center px-32 py-16">
            <div className="flex w-4/5 flex-col items-center">
              <h1 className="mb-12 text-3xl font-medium">
                Welcome to Jennifer Ann's Group
              </h1>
              <p className="mb-8 text-center text-lg text-gray-500">
                When it's colder than the far side of the moon and spitting rain
                too, you've still got to look good. From water-repellent leather
                to a rugged outsole, the Lunar Force 1 adapts AF-1 style, so you
                can keep your flame burning when the weather hits. Metal lace
                hardware and extended tongue bring mountain boot toughness.
              </p>
              <p className="text-center text-lg text-gray-500">
                When it's colder than the far side of the moon and spitting rain
                too, you've still got to look good. From water-repellent leather
                to a rugged outsole, the Lunar Force 1 adapts AF-1 style, so you
                can keep your flame burning when the weather hits. Metal lace
                hardware and extended tongue bring mountain boot toughness.
              </p>
            </div>
          </div>
          <div className="py-16">
            <h1 className="text-5xl font-semibold text-orange-primary">
              Check out what's new!
            </h1>
          </div>
        </div>
        <Footer />
      </SessionProvider>
    </div>
  );
};

export default Home;
