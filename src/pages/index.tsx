import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { userDataSchema } from "@/components/ProfileModal/ProfileModal";
import { z } from "zod";
import Image from "next/image";
import Link from "next/link";
import { Edit2Icon } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { IHomePage } from "@/server/db/models/HomePageModel";
import MdEditor from "react-markdown-editor-lite";
import MarkdownIt from "markdown-it";
import Markdown from "react-markdown";
import insert from "markdown-it-ins";
import "react-markdown-editor-lite/lib/index.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { WarningTwoIcon } from "@chakra-ui/icons";
import cx from "classnames";
import EditGameBoyModal from "@/components/HomePage/EditGameBoyModal";
import GameBoy from "@/components/HomePage/GameBoy";
import MarkdownRenderer from "@/components/MarkdownRenderer";

// const mdPlugins = ["font-bold", "font-italic", "font-underline"];
const mdParser = new MarkdownIt().use(insert);

const Home = () => {
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [edit, setEdit] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editError, setEditError] = useState("");

  const {
    data: pageData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["homepage"],
    queryFn: async () => {
      const response = await fetch("/api/homepage");
      if (!response.ok) {
        throw new Error("Failed to fetch homepage");
      }
      const data = await response.json();
      return data as IHomePage;
    },
    retry: 3,
  });

  const editTitleDescription = useMutation({
    mutationFn: () => {
      return axios.put(
        "/api/homepage",
        JSON.stringify({
          mdTitle: editTitle,
          mdDescription: editDescription,
        }),
        {
          headers: {
            "Content-Type": "text",
          },
        },
      );
    },
    onSuccess: async () => {
      await refetch();
      setEdit(false);
      setEditError("");
    },
    onError: () => {
      setEditError("Failed to update title and description");
    },
  });

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

  if (isLoading) {
    return <></>;
  }

  if (!pageData) {
    return <>Missing home page data</>;
  }

  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-center py-32">
          <h1 className="mb-12 text-center font-rubik text-7xl font-extrabold text-stone-primary">
            Jennifer Ann&apos;s Group
          </h1>
          <h2 className="text-center text-5xl font-medium italic text-orange-primary">
            Gaming against violence.
          </h2>
        </div>
        <div className="flex w-full flex-col items-center bg-blue-bg py-16">
          {edit ? (
            <div className="flex w-4/5 max-w-7xl flex-col space-y-6">
              <div className="flex space-x-4">
                <h1 className="inline-block text-2xl font-medium">
                  Title<span className="text-orange-primary">*</span>
                </h1>
                <div className="w-96">
                  <Input
                    defaultValue={pageData.mdTitle}
                    onChange={(e) => {
                      setEditTitle(e.target.value);
                    }}
                  />
                </div>
              </div>
              <MdEditor
                // plugins={mdPlugins}
                renderHTML={(text) => mdParser.render(text)}
                defaultValue={pageData.mdDescription}
                onChange={(data) => {
                  setEditDescription(data.text);
                }}
              />
              <div
                className={cx("flex", {
                  "justify-between": editError,
                  "justify-end": !editError,
                })}
              >
                {editError && (
                  <div className="flex content-center space-x-2">
                    <WarningTwoIcon className="h-full text-delete-red" />
                    <p className="py-2 text-delete-red">{editError}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-3 self-end">
                  <Button
                    className="bg-transparent text-black hover:bg-transparent"
                    onClick={() => {
                      setEdit(false);
                      setEditError("");
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-blue-primary"
                    onClick={() => {
                      if (!editTitle || !editDescription) {
                        setEditError("Title and description are required!");
                        return;
                      }
                      editTitleDescription.mutate();
                    }}
                  >
                    Save changes
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex w-full max-w-7xl flex-col items-center">
              {userData?.label === "administrator" && (
                <Edit2Icon
                  className="absolute right-20 top-4 cursor-pointer self-end text-gray-500"
                  onClick={() => {
                    setEdit(true);
                    setEditTitle(pageData.mdTitle);
                    setEditDescription(pageData.mdDescription);
                  }}
                />
              )}
              <div className="w-4/5 items-center">
                <h1 className="mb-12 text-center text-3xl font-medium">
                  {pageData.mdTitle}
                </h1>
                <MarkdownRenderer
                  markdown={pageData.mdDescription}
                  parse={(markdown) => mdParser.render(markdown)}
                />
              </div>
            </div>
          )}
        </div>
        <div className="relative flex w-full flex-col items-center py-16">
          {userData?.label === "administrator" && !edit && (
            <EditGameBoyModal
              gameBoyTitle={pageData.gameBoyTitle}
              gameBoyData={pageData.gameBoys}
              refetchHomePage={refetch}
            />
          )}
          <h1 className="mb-12 text-center text-5xl font-semibold text-orange-primary">
            {pageData.gameBoyTitle}
          </h1>
          <div className="flex w-full max-w-7xl justify-center space-x-20 px-16">
            {pageData.gameBoys.map((gameBoy, index) => {
              if (!gameBoy.gameId) {
                return <></>;
              }

              return (
                <div key={index} className="max-w-xs flex-1">
                  {/* replace "/imgpreviewexample.jpeg" with image preview once implemented */}
                  <GameBoy image="/imgpreviewexample.jpeg" />
                  <p className="mt-12 text-center text-gray-500">
                    {gameBoy.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex w-full flex-col items-center bg-blue-bg px-32 py-16">
          <div className="flex flex-row items-center">
            <Image
              src={`/social/Discord.svg`}
              className="mr-16 -rotate-6 fill-blue-primary"
              width={120}
              height={120}
              alt="Discord Icon"
            />
            <div>
              <h2 className="mb-4 text-3xl font-semibold text-blue-primary">
                Want to learn more about Gaming Against Violence?
              </h2>
              <p className="text-3xl italic text-blue-primary">
                Join our{" "}
                <Link className="underline" href="" target="_blank">
                  Jennifer Ann&apos;s Group&apos;s discord!
                </Link>
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-7xl flex-col px-32 py-32">
          <div className="flex flex-row content-start items-center">
            <img src={`/bog_logo_2.svg`} alt="Bits of Good Logo" />
            <div className="ml-12">
              <img src={`/bog_logo_1.svg`} alt="Bits of Good Logo" />
              <p className="mt-3 text-2xl font-semibold text-orange-primary">
                Thanks to Bits of Good for helping create our site!
              </p>
            </div>
          </div>
          <div className="mt-16 flex flex-row justify-between">
            <div className="w-2/5">
              <h1 className="mb-8 text-2xl font-medium">About Bits of Good</h1>
              <p className="text-lg">
                Georgia Tech Bits of Good connects students with local
                nonprofits by building powerful web apps, redefining social good
                to make an impact with a technical background.
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
    </div>
  );
};

export default Home;
