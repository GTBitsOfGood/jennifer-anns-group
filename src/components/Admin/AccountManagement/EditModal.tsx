import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent } from "../../ui/dialog";
import { Admin } from "@/pages/admin/account-management";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { userSchema } from "@/utils/types";
import { z } from "zod";
import { signOut, useSession } from "next-auth/react";
import router from "next/router";

const idSchema = z.string().length(24);

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: Admin | null | undefined;
  fetchData: () => void;
}

enum UpdateLabel {
  Student = "student",
  Parent = "parent",
  Educator = "educator",
  //Delete = "delete",
}

const UPDATE_LABEL_MAP: Record<UpdateLabel, string> = {
  [UpdateLabel.Student]: "Student",
  [UpdateLabel.Parent]: "Parent",
  [UpdateLabel.Educator]: "Educator",
  //[UpdateLabel.Delete]: "Delete Account",
};

function EditModal({ open, setOpen, admin }: Props) {
  const { status, data } = useSession();
  const [selectedRole, setSelectedRole] = useState<UpdateLabel>(
    UpdateLabel.Student,
  );

  if (!admin) {
    return <div></div>;
  }

  const isCurrUser = () => {
    if (data?.user.email === admin.email) {
      return true;
    }
    return false;
  };

  const handleUpdateRole = async () => {
    try {
      await handleAdminDelete();
      const userData = await fetchUserByEmail(admin.email);
      if (!userData) {
        console.log("User doesn't exist, no need to update role");
        setOpen(false);
        return;
      }
      const currUser = await isCurrUser();
      if (userData) {
        const updatedUserData = { ...userData, label: selectedRole };
        await updateUser(updatedUserData);
      }
      setOpen(false);
      if (currUser) {
        router?.push("/");
      }
    } catch (error) {
      console.error("Error updating role:", error);
    }
  };

  const handleAdminDelete = async () => {
    try {
      const response = await fetch(`../api/admin/${admin._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        return error;
      }
      return response;
    } catch (error) {
      console.error("Error deleting admin:", error);
      return error;
    }
  };

  const fetchUserByEmail = async (email: string) => {
    try {
      const response = await fetch(`../api/users?email=${email}`);
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  };

  const updateUser = async (
    userData: z.infer<typeof userSchema> & { _id: z.infer<typeof idSchema> },
  ) => {
    try {
      const response = await fetch(`../api/users/${userData._id}?type=info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(error);
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col items-center border-4 border-blue-primary px-16 pb-16 pt-32"
        isDelete={true}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-center font-inter text-2xl font-semibold text-blue-primary">
            Are you sure you want to remove <br /> account privileges for <br />
            <span className="break-all font-normal ">
              &quot;{admin?.email}&quot;
            </span>{" "}
            ?
          </h2>
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-1.5">
              <div className="font-small  ">
                Select the user&apos;s non-admin account type
              </div>
              <Select
                defaultValue={UpdateLabel.Student}
                onValueChange={(value) => setSelectedRole(value as UpdateLabel)}
              >
                <SelectTrigger className="border-stone-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-white">
                  {Object.entries(UPDATE_LABEL_MAP).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <DialogClose asChild>
                <Button variant="outline2" className="w-48">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="mainblue"
                type="submit"
                form="form"
                className="w-48"
                onClick={handleUpdateRole}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default EditModal;
