import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { MoveLeft } from "lucide-react";
import { changePWSchema, userSchema } from "@/utils/types";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";

export function ProfileModal() {
  const [profileState, setProfileState] = useState<
    "view" | "changePw" | "edit"
  >("view");
  const [open, setOpen] = useState(false);

  const userDataSchema = userSchema.extend({
    _id: z.string().length(24),
  });

  const { data: session } = useSession();
  const currentUser = session?.user;
  const [userData, setUserData] = useState<z.infer<typeof userDataSchema>>();

  useEffect(() => {
    if (currentUser) {
      getUserData();
    }
  }, [currentUser]);

  async function getUserData() {
    try {
      const response = await fetch(`/api/users/${currentUser?._id}`);
      const data = await response.json();
      setUserData(data.data);
    } catch (error) {
      console.error("Error getting user:", error);
    }
  }

  async function editUser(
    data: z.infer<typeof userDataSchema> | z.infer<typeof changePWSchema>,
    type: "info" | "password"
  ) {
    try {
      const params = new URLSearchParams({ type: type });

      const response = await fetch(`/api/users/${currentUser?._id}/?${params.toString()}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error(`Error editing user ${type}:`, error);
    }
  }

  const profileStateLabels = {
    view: "Profile",
    edit: "Edit Profile",
    changePw: "Edit Password",
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="mainorange" onClick={() => setProfileState("view")}>
            Your profile
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[425px] py-10 px-12  border-solid border-4 border-blue-primary">
          <DialogHeader>
            {profileState == "changePw" && (
              <div className="absolute left-4 top-4 rounded-sm opacity-100 ring-offset-white transition-opacity hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
                <MoveLeft
                  onClick={() => {
                    setProfileState("edit");
                  }}
                  className="h-6 w-6 text-blue-primary"
                />
              </div>
            )}
            <DialogTitle className="text-lg text-blue-primary font-semibold -mb-2">
              {profileStateLabels[profileState]}
            </DialogTitle>
          </DialogHeader>

          {profileState == "view" && (
            <ViewProfileModal
              setProfileState={setProfileState}
              userData={userData}
            />
          )}
          {profileState == "edit" && (
            <EditProfileModal
              setProfileState={setProfileState}
              userData={userData}
              setUserData={setUserData}
              setOpen={setOpen}
              editUser={editUser}
            />
          )}
          {profileState == "changePw" && (
            <ChangePasswordModal
              setProfileState={setProfileState}
              userData={userData}
              editUser={editUser}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}