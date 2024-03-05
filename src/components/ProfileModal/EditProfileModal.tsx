import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { userSchema } from "@/utils/types";
import cn from "classnames";
import { z } from "zod";

import { useState } from "react";
import {
  ProfileState,
  userDataSchema,
  EditUserParams,
  EditUserReturnValue,
} from "./ProfileModal";

const formUserSchema = userSchema.omit({ hashedPassword: true, notes: true });

type EditProps = {
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  userData: z.infer<typeof userDataSchema> | undefined;
  setUserData: React.Dispatch<
    React.SetStateAction<z.infer<typeof userDataSchema> | undefined>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: (...args: EditUserParams) => EditUserReturnValue;
};

function EditProfileModal(props: EditProps) {
  const FNAME_FORM_KEY = "firstName";
  const LNAME_FORM_KEY = "lastName";
  const EMAIL_FORM_KEY = "email";
  const LABEL_FORM_KEY = "label";

  const [invalidEmail, setInvalidEmail] = useState("");

  async function handleProfileFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      firstName: formData.get(FNAME_FORM_KEY),
      lastName: formData.get(LNAME_FORM_KEY),
      label: formData.get(LABEL_FORM_KEY),
      email: formData.get(EMAIL_FORM_KEY),
    };
    const parse = formUserSchema.safeParse(input);
    if (parse.success) {
      try {
        const res = await props.editUser(
          {
            ...parse.data,
            _id: props.userData?._id!,
          },
          "info",
          props.userData?._id!,
        );
        if (res.error) {
          setInvalidEmail(res.error);
        } else {
          props.setOpen(false);
          props.setUserData({
            ...parse.data,
            _id: props.userData?._id!,
          });
          setInvalidEmail("");
        }
      } catch (error) {
        console.error("Error editing user:", error);
      }
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      if (errors.email) {
        setInvalidEmail(String(errors.email.at(0)));
      }
    }
  }

  return (
    <form onSubmit={handleProfileFormSubmit}>
      <div className="-my-2 grid grid-cols-8 gap-3 py-4">
        <div className="col-span-4 items-center">
          <Label
            htmlFor={FNAME_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            First Name
          </Label>
          <Input
            name={FNAME_FORM_KEY}
            id="firstName"
            defaultValue={props.userData?.firstName}
            className="col-span-3 text-xs font-light text-black"
          />
        </div>
        <div className="col-span-4 items-center">
          <Label
            htmlFor={LNAME_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            Last Name
          </Label>
          <Input
            id="lastName"
            name={LNAME_FORM_KEY}
            defaultValue={props.userData?.lastName}
            className="col-span-3 text-xs font-light text-black"
          />
        </div>
        <div className="col-span-8 items-center">
          <Label
            htmlFor={EMAIL_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            Email
          </Label>
          <Input
            name={EMAIL_FORM_KEY}
            id="email"
            defaultValue={props.userData?.email}
            autoComplete="email"
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500": invalidEmail !== "",
            })}
          />
          <p className="mt-1 text-xs text-red-500">{invalidEmail}</p>
        </div>

        <div className="col-span-8 items-center">
          <Label
            htmlFor={LABEL_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            Label
          </Label>

          <Select name={LABEL_FORM_KEY} defaultValue={props.userData?.label}>
            <SelectTrigger className="col-span-8 text-xs font-light">
              <SelectValue
                placeholder={props.userData?.label}
                className="text-red-500"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="educator">Educator</SelectItem>
                <SelectItem value="administrator">Administrator</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="col-span-8 items-center">
          <p
            onClick={() => props.setProfileState("changePw")}
            className="mb-6 mt-2 text-lg font-semibold text-blue-primary hover:cursor-pointer"
          >
            Change Password
          </p>
        </div>
      </div>
      <DialogFooter>
        <div className="relative mt-10 w-full">
          <Button
            variant="outline2"
            className="absolute bottom-0 left-0 px-4 text-lg"
            onClick={() => props.setProfileState("view")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="mainblue"
            className="absolute bottom-0 right-0 px-4 text-lg"
            onClick={() => props.setProfileState("edit")}
          >
            Save Changes
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default EditProfileModal;
