import { Button } from "../ui/button";
import { ProfileState, userDataSchema } from "./ProfileModal";
import { z } from "zod";
import { signOut } from "next-auth/react";

interface Props {
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  userData: z.infer<typeof userDataSchema> | undefined;
}

export default function DeleteComponentModal(props: Props) {
  async function deleteUser() {
    if (props.userData?._id === undefined) return;
    try {
      const response = await fetch(`../api/users/${props.userData._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(error);
      }
      signOut();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  }

  return (
    <div>
      <div className="text-center text-xl font-bold leading-tight text-blue-primary">
        Are you sure you want to delete your profile?
      </div>
      <div className="my-7 text-center font-sans text-sm font-normal">
        Deleting a profile is final and cannot be undone.
      </div>
      <div className="flex w-full flex-row flex-wrap justify-center gap-5">
        <Button onClick={deleteUser} variant="destructive" className="w-36">
          Yes, delete
        </Button>
        <Button
          onClick={() => props.setProfileState("view")}
          variant="outline"
          className="w-36"
        >
          No, return
        </Button>
      </div>
    </div>
  );
}
