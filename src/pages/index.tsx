import { Footer } from "@/components/Navigation/Footer";
import Header from "@/components/Navigation/Header";
import { SessionProvider } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { z } from "zod";
import Image from "next/image";
import discordIcon from "../../public/social/Discord.svg";
import bogLogo1 from "../../public/bog_logo_1.svg";
import bogLogo2 from "../../public/bog_logo_2.svg";
import gameboy from "../../public/gameboy.png";
import Link from "next/link";

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
            <h1 className="mb-12 font-rubik text-7xl font-extrabold text-stone-primary">
              Jennifer Ann's Group
            </h1>
            <h2 className="text-5xl font-medium italic text-orange-primary">
              Gaming against violence.
            </h2>
          </div>
          <div className="flex w-full flex-col items-center bg-blue-bg px-32 py-16">
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
            <h1 className="mb-12 text-center text-5xl font-semibold text-orange-primary">
              Check out what's new!
            </h1>
            <div className="grid grid-cols-3 gap-x-20 px-16">
              <div>
                <Image src={gameboy} alt="gameboy" />
                <p className="mt-12 text-center text-gray-500">
                  When it's colder than the far side of the moon and spitting
                  rain too, you've still got to look good.
                </p>
              </div>
              <div>
                <Image src={gameboy} alt="gameboy" />
                <p className="mt-12 text-center text-gray-500">
                  When it's colder than the far side of the moon and spitting
                  rain too, you've still got to look good. From water-repellent
                  leather to a rugged outsole, the Lunar Force 1 adapts AF-1
                  style.
                </p>
              </div>
              <div>
                <Image src={gameboy} alt="gameboy" />
                <p className="mt-12 text-center text-gray-500">
                  When it's colder than the far side of the moon and spitting
                  rain too, you've still got to look good. From water-repellent
                  leather to a rugged outsole.
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col items-center bg-blue-bg px-32 py-16">
            <div className="flex flex-row justify-center">
              <Image
                src={discordIcon}
                className="mr-16 -rotate-6 fill-blue-primary"
                alt="Discord Icon"
              />
              <div>
                <h2 className="mb-4 text-3xl font-semibold text-blue-primary">
                  Want to learn more about Gaming Against Violence?
                </h2>
                <p className="text-3xl italic text-blue-primary">
                  Join our{" "}
                  <Link className="underline" href="" target="_blank">
                    Jennifer Ann's Group's discord!
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col px-32 py-32">
            <div className="flex flex-row content-start items-center">
              <Image src={bogLogo2} alt="Bits of Good Logo" />
              <div className="ml-12">
                <Image src={bogLogo1} alt="Bits of Good Logo" />
                <p className="mt-3 text-2xl font-semibold text-orange-primary">
                  Thanks to Bits of Good for helping create our site!
                </p>
              </div>
            </div>
            <div className="mt-16 flex flex-row justify-between">
              <div className="w-2/5">
                <h1 className="mb-8 text-2xl font-medium">
                  About Bits of Good
                </h1>
                <p className="text-lg">
                  Georgia Tech Bits of Good connects students with local
                  nonprofits by building powerful web apps, redefining social
                  good to make an impact with a technical background.
                </p>
              </div>
              <div className="flex w-2/5 flex-col items-end">
                <div>
                  <h1 className="mb-8 text-2xl font-medium">
                    Special thanks to:
                  </h1>
                  <div className="flex flex-row space-x-8 text-lg">
                    <ul>
                      <li>Annie Vallamattam</li>
                      <li>Helen Chen</li>
                      <li>Liane Nguyen</li>
                      <li>Xingyi Luo</li>
                    </ul>
                    <ul>
                      <li>Aakash Gupta</li>
                      <li>Ankith Thalanki</li>
                      <li>Katsuki Chan</li>
                      <li>Lauren Ji</li>
                      <li>Nathan Gong</li>
                      <li>Uma Anand</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </SessionProvider>
    </div>
  );
};

export default Home;
