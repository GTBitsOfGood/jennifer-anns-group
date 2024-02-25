import React from "react";
// to do - check user type and find menu tabs based on that.
// responsiveness (hover? and click actions)
const Header = () => {
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
        <div
          className="font-Outfit mr-4 text-center text-sm font-normal text-stone-900 opacity-50"
          style={{ marginRight: "2.2rem" }}
        >
          Home
        </div>
        <div
          className="font-Outfit mr-4 text-center text-sm font-bold text-amber-500"
          style={{ marginRight: "2.2rem" }}
        >
          Game Gallery
        </div>
        <div
          className="font-Outfit mr-4 text-center text-sm font-normal text-stone-900 opacity-50"
          style={{ marginRight: "2.2rem" }}
        >
          Donate
        </div>
        <div
          className="mr-4 rounded-md bg-amber-500 px-4 py-2"
          style={{ marginLeft: "6rem" }}
        >
          <div className="font-Outfit text-center text-sm font-normal text-white">
            Log in
          </div>
        </div>
        <div
          className="rounded-md border border-gray-100 bg-white px-4 py-2 shadow"
          style={{ marginRight: "6.8rem" }}
        >
          <div className="font-Outfit text-center text-sm font-normal text-neutral-600">
            Sign up
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
