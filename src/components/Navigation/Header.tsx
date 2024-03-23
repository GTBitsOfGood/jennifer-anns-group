import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ProfileModal, userDataSchema } from "../ProfileModal/ProfileModal";
import { Button } from "../ui/button";
import { z } from "zod";
import { UserLabel } from "@/utils/types";

enum UserType {
  Public = "Public",
  AccountHolder = "AccountHolder",
  Admin = "Admin",
}

const userLabelToType = {
  [UserLabel.Educator]: UserType.AccountHolder,
  [UserLabel.Student]: UserType.AccountHolder,
  [UserLabel.Parent]: UserType.AccountHolder,
  [UserLabel.Administrator]: UserType.Admin,
};

type TabLinks = {
  [tabName: string]: string;
};

const tabLinks: TabLinks = {
  Home: "/",
  "Game Gallery": "/games",
  Donate: "https://www.paypal.com/paypalme/stopTDV",
  "Account Management": "/admin/account-management",
  "Themes and Tags": "/admin/themes",
};

const tabData = {
  [UserType.Public]: ["Home", "Game Gallery", "Donate"],
  [UserType.AccountHolder]: ["Home", "Game Gallery", "Donate"],
  [UserType.Admin]: [
    "Home",
    "Game Gallery",
    "Donate",
    "Account Management",
    "Themes and Tags",
  ],
};

const Header = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [selectedTab, setSelectedTab] = useState(0);
  const userType = userData?.label
    ? userLabelToType[userData.label]
    : UserType.Public;

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
    const pathname = router.pathname;
    const tabNames = Object.keys(tabLinks);
    const index = tabNames.findIndex((name) => tabLinks[name] === pathname);
    setSelectedTab(index !== -1 ? index : 0);
  }, [currentUser, router.pathname]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.log("Error getting user:", error);
    }
  }

  function handlePageChange(tabname: string, index: number) {
    if (tabname !== "Donate") {
      setSelectedTab(index);
    }
  }

  function handleSignUpLogOut() {
    if (userType !== UserType.Public) {
      signOut();
    } else {
      router.push("/signup");
    }
  }

  return (
    <div className="fixed left-0 top-0 flex w-full justify-center">
      <div className="mx-auto flex h-16 w-10/12 items-center justify-between bg-white p-12">
        <div className="flex items-center">
          <img className="w-50 h-auto" src="/logo_gray.svg" alt="Logo" />
          <div className="ml-6 font-open-sans text-xl font-semibold text-stone-900 opacity-70">
            Jennifer Ann’s Group
          </div>
        </div>
        <div className="flex items-center">
          {tabData[userType].map((tabName, index) => (
            <div
              key={index}
              className={`font-Outfit mr-8 cursor-pointer text-center text-sm ${
                selectedTab === index
                  ? "relative font-bold text-orange-primary"
                  : "font-normal text-stone-900 opacity-50"
              } hover:text-orange-primary`}
              onClick={() => handlePageChange(tabName, index)}
            >
              <div>
                <Link
                  href={tabLinks[tabName]}
                  target={tabName === "Donate" ? "_blank" : ""}
                >
                  {tabName}
                </Link>
                {selectedTab === index && (
                  <div className="absolute left-1/2 top-8 h-0.5 w-full -translate-x-1/2 transform bg-orange-primary" />
                )}
              </div>
            </div>
          ))}
          <div className="ml-10 px-4 py-2">
            {userType === UserType.Public ? (
              <Link href="/login">
                <Button variant="mainorange">Log in</Button>
              </Link>
            ) : (
              <ProfileModal userData={userData} setUserData={setUserData} />
            )}
          </div>
          <div
            className="cursor-pointer rounded-md border border-gray-100 bg-white px-4 py-2 shadow"
            onClick={handleSignUpLogOut}
          >
            <div className="font-Outfit text-center text-sm font-normal text-neutral-600">
              {userType === UserType.Public ? "Sign up" : "Log out"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
