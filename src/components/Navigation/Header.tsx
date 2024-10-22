import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { ProfileModal, userDataSchema } from "../ProfileModal/ProfileModal";
import { Button } from "../ui/button";
import { z } from "zod";
import { UserLabel } from "@/utils/types";
import Select from "react-select";
import { log } from "util";

type TabName = "Home" | "Game Gallery" | "Donate" | "Admin";

enum UserType {
  Public = "Public",
  AccountHolder = "AccountHolder",
  Admin = "Admin",
}

const userLabelToType: Record<UserLabel, UserType> = {
  [UserLabel.Educator]: UserType.AccountHolder,
  [UserLabel.Student]: UserType.AccountHolder,
  [UserLabel.Parent]: UserType.AccountHolder,
  [UserLabel.Administrator]: UserType.Admin,
};

const tabLinks: Record<TabName, string[]> = {
  Home: ["/"],
  "Game Gallery": ["/games"],
  Donate: ["https://www.paypal.com/paypalme/stopTDV"],
  Admin: ["/admin/cms-dashboard", "/admin/account-management", "/admin/themes"],
};

const tabData: Record<UserType, TabName[]> = {
  [UserType.Public]: ["Home", "Game Gallery", "Donate"],
  [UserType.AccountHolder]: ["Home", "Game Gallery", "Donate"],
  [UserType.Admin]: ["Home", "Game Gallery", "Donate", "Admin"],
};

const Header = () => {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();
  const [selectedTab, setSelectedTab] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const userType = userData?.label
    ? userLabelToType[userData.label as UserLabel]
    : UserType.Public;

  useEffect(() => {
    if (status === "loading") return;
    if (currentUser) {
      getUserData();
    } else {
      setLoaded(true);
    }
    const pathname = router.pathname;
    const tabNames = Object.keys(tabLinks) as TabName[];
    const index = tabNames.findIndex((name) =>
      tabLinks[name].includes(pathname),
    ); // this might need to be changed later on, pathname could be dynamic
    setSelectedTab(index !== -1 ? index : 1); // set default to game gallery (for game screen, create game, edit game)
  }, [status, router.pathname]);

  function getUserData() {
    setUserData(currentUser);
    setLoaded(true);
  }

  function handleSignUpLogOut() {
    if (userType !== UserType.Public) {
      signOut({ callbackUrl: "/" });
    } else {
      router.push("/signup");
    }
  }

  function handlePageChange(i: number) {
    const tabName = tabData[userType][i];
    const tabLink = tabLinks[tabData[userType][i]];
    if (tabName !== "Donate") {
      setSelectedTab(i);
      router.push(tabLink[0]);
    } else {
      window.open(tabLink[0], "_blank");
    }
  }

  const TabLinkOptions = (
    <>
      {/* for larger screens */}
      <div
        className={`mr-10 hidden items-center ${userType === UserType.Admin ? "2xl:flex" : "lg:flex"}`}
      >
        {tabData[userType].map((tabName, index) => (
          <div
            key={index}
            className={`ml-8 cursor-pointer text-nowrap text-center font-sans text-lg ${
              selectedTab === index
                ? "relative font-bold text-orange-primary"
                : "font-normal text-stone-900 opacity-50"
            } hover:text-orange-primary`}
            onClick={() => handlePageChange(index)}
          >
            <div>
              {tabName}
              {selectedTab === index && (
                <div className="absolute left-1/2 top-8 h-0.5 w-full -translate-x-1/2 transform bg-orange-primary" />
              )}
            </div>
          </div>
        ))}
      </div>
      {/* for smaller screens */}
      <Select
        className={`relative m-2 ${userType === UserType.Admin ? "2xl:hidden" : "lg:hidden"}`}
        classNames={{
          control: () =>
            `${userType === UserType.Admin ? "w-56" : "w-40"} cursor-pointer rounded-md outline-none ring-0 text-nowrap font-sans font-semibold text-lg bg-orange-bg border-none`,
          singleValue: () => "text-neutral-600",
          menu: () => `cursor-pointer rounded-md bg-input-bg m-0 ring-0`,
          option: () =>
            "cursor-pointer text-nowrap font-sans text-lg bg-input-bg text-neutral-600",
          indicatorSeparator: () => "hidden",
          dropdownIndicator: () => "text-neutral-600",
        }}
        options={tabData[userType]
          .map((item) => ({
            value: item,
            label: item,
          }))
          .filter((option) => option.label !== tabData[userType][selectedTab])}
        onChange={(e) =>
          e && handlePageChange(tabData[userType].indexOf(e.value as TabName))
        }
        value={{
          value: tabData[userType][selectedTab],
          label: tabData[userType][selectedTab],
        }}
        isSearchable={false}
      />
    </>
  );

  const ProfileButtons = (
    <div className="mx-2 my-2 flex items-center gap-4">
      {userType === UserType.Public ? (
        <Button
          variant="mainorange"
          className="text-lg"
          onClick={() => {
            router.push("/login");
          }}
        >
          Log in
        </Button>
      ) : (
        <ProfileModal
          userData={userData}
          setUserData={setUserData}
          updateSession={update}
          sessionData={session}
        />
      )}
      <Button variant="gray" className="text-lg" onClick={handleSignUpLogOut}>
        {userType === UserType.Public ? "Sign up" : "Log out"}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto my-6 flex w-[calc(100%-4rem)] max-w-[90%] flex-wrap items-center justify-between">
      <div
        className="flex items-center hover:cursor-pointer"
        onClick={() => {
          router.push("/");
        }}
      >
        <img className="w-50 h-auto" src="/logo_gray.svg" alt="Logo" />
        <div className="ml-4 text-nowrap font-open-sans text-xl font-semibold text-stone-900 opacity-70">
          Jennifer Ann&apos;s Group
        </div>
      </div>
      {loaded && (
        <div className="flex flex-wrap items-center">
          {TabLinkOptions}
          {ProfileButtons}
        </div>
      )}
    </div>
  );
};

export default Header;
