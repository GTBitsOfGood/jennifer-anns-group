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
      <div className="-my-2 grid grid-cols-8 gap-3 py-4">
        <div className="col-span-4 items-center">
          <Label className="text-right text-lg font-normal">First Name</Label>

          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            {props.userData?.firstName}
          </p>
        </div>
        <div className="col-span-4 items-center">
          <Label className="text-right text-lg font-normal">Last Name</Label>

          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            {props.userData?.lastName}
          </p>
        </div>
        <div className="col-span-8 items-center">
          <Label className="text-right text-lg font-normal">Email</Label>

          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            {props.userData?.email}
          </p>
        </div>

        <div className="col-span-8 items-center">
          <Label className="text-right text-lg font-normal">Label</Label>

          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            {props.userData?.label
              ? props.userData?.label.charAt(0).toUpperCase() +
                props.userData?.label.slice(1)
              : ""}
          </p>
        </div>
        <div className="col-span-8 items-center">
          <Label className="text-right text-lg font-normal">Password</Label>
          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            ********
          </p>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="mainblue"
          className="px-6 text-lg"
          onClick={() => props.setProfileState("edit")}
        >
          Edit
        </Button>
      </DialogFooter>
    </>
  );
}

export default ViewProfileModal;
