import React, { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
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
  Delete = "delete",
}

const UPDATE_LABEL_MAP: Record<UpdateLabel, string> = {
  [UpdateLabel.Student]: "Student",
  [UpdateLabel.Parent]: "Parent",
  [UpdateLabel.Educator]: "Educator",
  [UpdateLabel.Delete]: "Delete Account",
};

function DeleteModal({ open, setOpen, admin }: Props) {
  const { status, data } = useSession();
  const [selectedRole, setSelectedRole] = useState<UpdateLabel>(
    UpdateLabel.Student,
  );

  if (!admin) {
    return <div></div>;
  }

  const isCurrUser = async () => {
    try {
      const response = await fetch(`../api/users/${data?.user._id}`);
      const responseData = await response.json();
      const email = responseData.email;
      if (email === admin.email) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching user status");
    }
  };

  const handleUpdateRole = async () => {
    if (selectedRole === UpdateLabel.Delete) {
      await handleDeleteAccount();
      return;
    }
    try {
      await handleAdminDelete();
      const userData = await fetchUserByEmail(admin.email);
      const currUser = await isCurrUser();
      if (userData) {
        const updatedUserData = { ...userData, label: selectedRole };
        await updateUser(updatedUserData);
      }
      setOpen(false);
      if (currUser) {
        router.push("/");
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

  const handleDeleteAccount = async () => {
    try {
      await handleAdminDelete();
      const userData = await fetchUserByEmail(admin.email);
      const currUser = await isCurrUser();
      if (userData) {
        await deleteUser(userData._id);
      }
      if (currUser) {
        signOut();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
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

  const deleteUser = async (userId: string) => {
    try {
      const response = await fetch(`../api/users/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.text();
        console.error(error);
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col items-center border-4 border-blue-primary px-16 pb-28 pt-32"
        isDelete={true}
      >
        <div className="flex flex-col gap-14">
          <h2 className="text-center font-inter text-2xl font-semibold text-blue-primary">
            Are you sure you want to remove <br /> administrator privileges for{" "}
            <br />
            <span className="break-all font-normal italic">
              &quot;{admin?.email}&quot;
            </span>{" "}
            ?
          </h2>
          <div className="flex flex-col gap-20">
            <div className="flex flex-col gap-1.5">
              <div className="text-2xl font-medium text-blue-primary">
                Update Role
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
                    <SelectItem
                      key={value}
                      value={value}
                      className={
                        value == UpdateLabel.Delete ? "text-red-800" : ""
                      }
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex w-full flex-row flex-wrap justify-center gap-11">
              <Button
                variant="primary"
                type="submit"
                form="form"
                className="w-48 bg-red-700 hover:bg-red-800"
                onClick={handleUpdateRole}
              >
                Yes, confirm
              </Button>
              <DialogClose asChild>
                <Button variant="outline" className="w-48">
                  No, return
                </Button>
              </DialogClose>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteModal;
