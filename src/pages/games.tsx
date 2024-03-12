import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Divider } from "@chakra-ui/react";
import GameCard from "@/components/GameComponent/GameCard";
import { gameSchema } from "@/utils/types";

export default function Games() {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [games, setGames] = useState<z.infer<typeof gameSchema>[]>();
  useEffect(() => {
    getGames();
  }, []);

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

  async function getGames() {
    const response = await fetch(`/api/games/?page=1`);
    const data = await response.json();
    setGames(data);
  }

  return (
    <div>
      <Header
        label={userData?.label}
        userData={userData}
        setUserData={setUserData}
      />
      <br></br>

      <h1 className="mb-16 mt-10 text-center font-sans text-6xl font-semibold">
        Game Gallery
      </h1>

      <div className="margin-auto ml-[10vw] w-[80vw]">
        <Divider borderColor="brand.700" borderWidth="1px" />
      </div>

      <div className="flex flex-row">
        {/* <ScrollBar /> */}

        <div className="ml-6 mt-[60px] flex flex-row flex-wrap">
          {games
            ? games.map((game) => {
                return <GameCard game={game} />;
              })
            : null}
        </div>
      </div>

      <Footer />
    </div>
  );
}
