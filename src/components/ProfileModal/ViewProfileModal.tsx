import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import React from "react";

type ViewProps = {
  setProfileState: React.Dispatch<
    React.SetStateAction<"view" | "edit" | "changePw">
  >;
  userData:
    | {
        email: string;
        hashedPassword: string;
        firstName: string;
        lastName: string;
        label: "educator" | "student" | "parent" | "administrator";
        _id: string;
      }
    | undefined;
};

function ViewProfileModal(props: ViewProps) {
  return (
    <>
      <div className="grid grid-cols-8 gap-3 py-4 -my-2">
        <div className="items-center col-span-4">
          <Label className="text-right text-lg font-normal">First Name</Label>

          <p className="text-sm font-light text-blue-primary col-span-3 py-2">
            {props.userData?.firstName}
          </p>
        </div>
        <div className="items-center col-span-4">
          <Label className="text-right text-lg font-normal">Last Name</Label>

          <p className="text-sm font-light text-blue-primary col-span-3 py-2">
            {props.userData?.lastName}
          </p>
        </div>
        <div className="items-center col-span-8">
          <Label className="text-right text-lg font-normal">Email</Label>

          <p className="text-sm font-light text-blue-primary col-span-3 py-2">
            {props.userData?.email}
          </p>
        </div>

        <div className="items-center col-span-8">
          <Label className="text-right text-lg font-normal">Label</Label>

          <p className="text-sm font-light text-blue-primary col-span-3 py-2">
            {props.userData?.label
              ? props.userData?.label.charAt(0).toUpperCase() +
                props.userData?.label.slice(1)
              : ""}
          </p>
        </div>
        <div className="items-center col-span-8">
          <Label className="text-right text-lg font-normal">Password</Label>
          <p className="text-sm font-light text-blue-primary col-span-3 py-2">
            ********
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="mainblue"
          className="text-lg px-6"
          onClick={() => props.setProfileState("edit")}
        >
          Edit
        </Button>
      </DialogFooter>
    </>
  );
}

export default ViewProfileModal;
