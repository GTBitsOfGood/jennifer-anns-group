import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";
import React from "react";

const index = () => {
  const { data, status } = useSession();
  return (
    <div>
      <h1 className="text-4xl text-orange-500 mt-10 ml-10">Hello World</h1>
      {status === "authenticated" ? (
        <Button onClick={() => signOut()}>Log out</Button>
      ) : null}
    </div>
  );
};

export default index;
