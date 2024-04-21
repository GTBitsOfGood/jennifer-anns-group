import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { userDataSchema, ProfileState } from "./ProfileModal";
import { z } from "zod";

import React from "react";

type ViewProps = {
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  userData: z.infer<typeof userDataSchema> | undefined;
};

function ViewProfileModal(props: ViewProps) {
  return (
    <>
      <div className="-my-2 grid grid-cols-8 gap-3 py-4 font-sans">
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
          <Label className="text-right text-lg font-normal">Role</Label>

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
        <div className="relative mt-10 w-full">
          <Button
            variant="destructive"
            className="absolute bottom-0 left-0 px-4 font-sans text-lg font-semibold"
            onClick={() => props.setProfileState("deleteUser")}
          >
            Delete Profile
          </Button>
          <Button
            variant="mainblue"
            className="absolute bottom-0 right-0 px-4 text-lg"
            onClick={() => props.setProfileState("edit")}
          >
            Edit
          </Button>
        </div>
      </DialogFooter>
    </>
  );
}

export default ViewProfileModal;
