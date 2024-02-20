import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const Home = () => {
  const { data, status } = useSession();
  return (
    <div>
      <h1 className="ml-10 mt-10 text-4xl text-orange-500">Hello World</h1>
      {status === "authenticated" ? (
        <Button onClick={() => signOut()}>Log out</Button>
      ) : null}
    </div>
  );
};

export default Home;
