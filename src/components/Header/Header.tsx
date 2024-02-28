import React, { useState } from "react";
import { UserType } from "@/utils/types/userTypes";
import { signOut } from "next-auth/react";

interface Props {
  user?: UserType;
}

type TabLinks = {
  [tabName: string]: string;
};

const Header = (props: Props) => {
  const userType = props.user || UserType.Public;
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
    "Themes and Tags": "/admin/themes-and-tags",
  };

  const [selectedTab, setSelectedTab] = useState<number>(0);

  function handleSignUpLogOut() {
    if (userType != UserType.Public) {
      signOut();
    } else {
      window.location.href = "/signup";
    }
  }

  return (
    <div className="relative flex h-16 w-screen items-center justify-between bg-white px-8">
      <div className="flex items-center">
        <img
          className="w-50 h-auto"
          src="/logo_gray.svg"
          alt="Logo"
          style={{ marginLeft: "6.8rem" }}
        />
        <img
          className="w-239 ml-4 h-auto"
          src="/jennifer-anns-text.svg"
          alt="Text Logo"
        />
      </div>
      <div className="flex items-center">
        {tabData[userType].map((tabName, index) => (
          <div
            key={index}
            className={`font-Outfit mr-4 text-center text-sm ${
              selectedTab === index
                ? "relative font-bold text-amber-500"
                : "font-normal text-stone-900 opacity-50"
            } hover:text-amber-500`}
            style={{ marginRight: "2.2rem", cursor: "pointer" }}
            onClick={() => setSelectedTab(index)}
          >
            <div>
              <a
                href={tabLinks[tabName]}
                target={tabName == "Donate" ? "_blank" : ""}
              >
                {tabName}
              </a>
              {selectedTab === index && (
                <div className="absolute left-1/2 top-8 h-0.5 w-full -translate-x-1/2 transform bg-amber-500" />
              )}
            </div>
          </div>
        ))}
        <a
          href={userType == UserType.Public ? "/login" : "/dummy/profile-modal"}
        >
          <div
            className="mr-4 rounded-md bg-amber-500 px-4 py-2"
            style={{ marginLeft: "3.8rem" }}
          >
            <div className="font-Outfit text-center text-sm font-normal text-white">
              {userType === UserType.Public ? "Log in" : "Your Profile"}
            </div>
          </div>
        </a>
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
  );
};

export default Header;
