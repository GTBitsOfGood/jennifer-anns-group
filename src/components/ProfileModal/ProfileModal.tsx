import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import { z } from "zod";
import { useSession } from "next-auth/react";
import { MoveLeft } from "lucide-react";
import { changePWSchema, userSchema } from "@/utils/types";
import ViewProfileModal from "./ViewProfileModal";
import EditProfileModal from "./EditProfileModal";
import ChangePasswordModal from "./ChangePasswordModal";
import DeleteUserModal from "./DeleteUserModal";
import PrivacyPolicyModal from "../Registration/PrivacyPolicyModal";

export type ProfileState = "view" | "changePw" | "edit" | "deleteUser";

const idSchema = z.string().length(24);

export const userDataSchema = userSchema
  .extend({
    _id: idSchema,
  })
  .omit({ hashedPassword: true, notes: true });

async function editUser(
  data: z.infer<typeof userDataSchema> | z.infer<typeof changePWSchema>,
  type: "info" | "password",
  id: z.infer<typeof idSchema>,
) {
  try {
    const params = new URLSearchParams({ type: type });

    const response = await fetch(`/api/users/${id}/?${params.toString()}`, {
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

export type EditUserParams = Parameters<typeof editUser>;
export type EditUserReturnValue = ReturnType<typeof editUser>;

type ProfileProps = {
  userData: z.infer<typeof userDataSchema> | undefined;
  setUserData: React.Dispatch<
    React.SetStateAction<z.infer<typeof userDataSchema> | undefined>
  >;
  sessionData: Session | null;
  updateSession: (data?: any) => Promise<Session | null>;
};

export function ProfileModal(props: ProfileProps) {
  const [profileState, setProfileState] = useState<ProfileState>("view");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = [props.userData, props.setUserData];
  const [privacyPolicyModalOpen, setPrivacyPolicyModalOpen] = useState(false);

  useEffect(() => {
    if (props.sessionData?.user) {
      setUserData(props.sessionData?.user);
    }
  }, [props.sessionData?.user, setUserData]);

  async function handleEditUser(
    data: z.infer<typeof userDataSchema> | z.infer<typeof changePWSchema>,
    type: "info" | "password",
    id: z.infer<typeof idSchema>,
  ) {
    const editRes = await editUser(data, type, id);
    if (editRes.result) {
      const sessionRes = await props.updateSession({ user: editRes.result });
    }
    return editRes;
  }

  const profileStateLabels: Record<ProfileState, string> = {
    view: "Profile",
    edit: "Edit Profile",
    changePw: "Edit Password",
    deleteUser: "",
  };

  return (
    <>
      <PrivacyPolicyModal
        isOpen={privacyPolicyModalOpen}
        onClose={() => setPrivacyPolicyModalOpen(false)}
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="mainorange"
            className="text-lg"
            onClick={() => setProfileState("view")}
          >
            Your profile
          </Button>
        </DialogTrigger>

        <DialogContent className="border-4 border-solid border-blue-primary  px-12 py-10 sm:max-w-[425px]">
          <DialogHeader>
            {profileState === "changePw" && (
              <div className="absolute left-4 top-4 rounded-sm opacity-100 ring-offset-white transition-opacity hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-slate-100 data-[state=open]:text-slate-500 dark:ring-offset-slate-950 dark:focus:ring-slate-300 dark:data-[state=open]:bg-slate-800 dark:data-[state=open]:text-slate-400">
                <MoveLeft
                  onClick={() => {
                    setProfileState("edit");
                  }}
                  className="h-6 w-6 text-blue-primary"
                />
              </div>
            )}
            <DialogTitle className="-mb-2 text-lg font-semibold text-blue-primary">
              {profileStateLabels[profileState]}
            </DialogTitle>
          </DialogHeader>

          {profileState === "view" && (
            <ViewProfileModal
              setProfileState={setProfileState}
              userData={userData}
            />
          )}
          {profileState === "edit" && (
            <EditProfileModal
              setProfileState={setProfileState}
              userData={userData}
              setUserData={setUserData}
              setOpen={setOpen}
              editUser={handleEditUser}
              setPrivacyPolicyModalOpen={setPrivacyPolicyModalOpen}
            />
          )}
          {profileState === "changePw" && (
            <ChangePasswordModal
              setProfileState={setProfileState}
              userData={userData}
              editUser={handleEditUser}
            />
          )}
          {profileState === "deleteUser" && (
            <DeleteUserModal
              setProfileState={setProfileState}
              userData={userData}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
