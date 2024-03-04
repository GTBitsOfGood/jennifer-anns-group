import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { ProfileModal, userDataSchema } from "../ProfileModal/ProfileModal";
import { Button } from "../ui/button";
import { UserLabel } from "@/utils/types";
import { z } from "zod";
import Link from "next/link";

interface Props {
  label: UserLabel | null | undefined;
  userData: z.infer<typeof userDataSchema> | undefined;
  setUserData: React.Dispatch<
    React.SetStateAction<z.infer<typeof userDataSchema> | undefined>
  >;
}

enum UserType {
  Public = "Public",
  AccountHolder = "AccountHolder",
  Admin = "Admin",
}

type TabLinks = {
  [tabName: string]: string;
};

const userLabelToType: Record<UserLabel, UserType> = {
  [UserLabel.Educator]: UserType.AccountHolder,
  [UserLabel.Student]: UserType.AccountHolder,
  [UserLabel.Parent]: UserType.AccountHolder,
  [UserLabel.Administrator]: UserType.Admin,
};

const Header = (props: Props) => {
  const router = useRouter();
  const userType = props.label ? userLabelToType[props.label] : UserType.Public;
  const tabData: { [key in UserType]: string[] } = {
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

  const tabLinks: TabLinks = {
    Home: "/",
    "Game Gallery": "/games",
    Donate: "https://www.paypal.com/paypalme/stopTDV",
    "Account Management": "/admin/account-management",
    "Themes and Tags": "/admin/themes",
  };

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [userData, setUserData] = [props.userData, props.setUserData];

  function handlePageChange(tabname: string, index: number) {
    if (tabname != "Donate") {
      setSelectedTab(index);
    }
  }

  function handleSignUpLogOut() {
    if (userType != UserType.Public) {
      signOut();
    } else {
      router.push("/signup");
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      <div className="relative flex h-16 w-screen items-center justify-between bg-white px-8">
        <div className="flex items-center">
          <img
            className="w-50 h-auto"
            src="/logo_gray.svg"
            alt="Logo"
            style={{ marginLeft: "6.8rem" }}
          />
          <div className="ml-6 font-open-sans text-xl font-semibold text-stone-900 opacity-70">
            Jennifer Ann’s Group
          </div>
        </div>
        <div className="flex items-center">
          {tabData[userType].map((tabName, index) => (
            <div
              key={index}
              className={`font-Outfit mr-4 text-center text-sm ${
                selectedTab === index
                  ? "relative font-bold text-orange-primary"
                  : "font-normal text-stone-900 opacity-50"
              } hover:text-orange-primary`}
              style={{ marginRight: "2.2rem", cursor: "pointer" }}
              onClick={() => handlePageChange(tabName, index)}
            >
              <div>
                <Link
                  href={tabLinks[tabName]}
                  target={tabName == "Donate" ? "_blank" : ""}
                >
                  {tabName}
                </Link>
                {selectedTab === index && (
                  <div className="absolute left-1/2 top-8 h-0.5 w-full -translate-x-1/2 transform bg-orange-primary" />
                )}
              </div>
            </div>
          ))}
          <div className="px-4 py-2" style={{ marginLeft: "3.8rem" }}>
            {userType === UserType.Public ? (
              // eslint-disable-next-line @next/next/no-html-link-for-pages
              <a href="/login">
                <Button variant="mainorange">Log in</Button>
              </a>
            ) : (
              <ProfileModal userData={userData} setUserData={setUserData} />
            )}
          </div>
          <div
            className="rounded-md border border-gray-100 bg-white px-4 py-2 shadow"
            style={{ marginRight: "6.8rem", cursor: "pointer" }}
            onClick={() => handleSignUpLogOut()}
          >
            <div className="font-Outfit text-center text-sm font-normal text-neutral-600">
              {userType === UserType.Public ? "Sign up" : "Log out"}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
