import React from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent } from "../../ui/dialog";
import { Admin } from "@/pages/admin/account-management";
import { z } from "zod";
import { signOut, useSession } from "next-auth/react";

const idSchema = z.string().length(24);

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  admin: Admin | null | undefined;
  fetchData: () => void;
}
function DeleteModal({ open, setOpen, admin }: Props) {
  const { status, data } = useSession();
  if (!admin) {
    return <div></div>;
  }
  const isCurrUser = () => {
    if (data?.user.email === admin.email) {
      return true;
    }
    return false;
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
      const response = await fetch(`../api/users?email=${email}`, {
        method: "GET",
      });
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return null;
    }
  };
  const handleDeleteAccount = async () => {
    try {
      console.log("Here");
      await handleAdminDelete(); //If this fails, we still delete
      const userData = await fetchUserByEmail(admin.email);
      console.log("Here");
      if (!userData) {
        console.log("User doesn't exist, no need to delete");
        setOpen(false);
        return;
      }
      const currUser = await isCurrUser();
      console.log(userData);
      if (userData) {
        console.log("Is this every called brh");
        await deleteUser(userData._id);
      }
      setOpen(false);
      if (currUser) {
        signOut();
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };
  const deleteUser = async (userId: string) => {
    try {
      console.log("Deletting user"); //These print statement never get called???
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
  //Actual code for DeleteModal

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col items-center border-4 border-blue-primary px-16 pb-16 pt-24"
        isDelete={true}
      >
        <div className="flex flex-col gap-6">
          <h2 className="text-center font-inter text-2xl font-semibold text-blue-primary">
            Are you sure you want to <br /> delete the account for <br />
            <span className="break-all font-normal ">
              &quot;{admin?.email}&quot;
            </span>{" "}
            ?
          </h2>
          <div className="flex flex-col gap-12">
            <div className="flex flex-col">
              <div className="font-small  ">
                Deleting an account is final and cannot be undone.
              </div>
            </div>

            <div className="flex w-full flex-row flex-wrap justify-center gap-4">
              <DialogClose asChild>
                <Button variant="outline2" className="w-48">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="primary"
                type="submit"
                form="form"
                className="w-48 bg-red-700 hover:bg-red-800"
                onClick={handleDeleteAccount}
              >
                Yes, delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default DeleteModal;
