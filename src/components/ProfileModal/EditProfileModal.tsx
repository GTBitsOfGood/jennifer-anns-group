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
import { useState, useEffect } from "react";

type EditProps = {
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
  setUserData: React.Dispatch<
    React.SetStateAction<
      | {
          email: string;
          hashedPassword: string;
          firstName: string;
          lastName: string;
          label: "educator" | "student" | "parent" | "administrator";
          _id: string;
        }
      | undefined
    >
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: (
    data:
      | {
          email: string;
          password: string;
          oldpassword: string;
          passwordConfirm: string;
        }
      | {
          email: string;
          hashedPassword: string;
          firstName: string;
          lastName: string;
          label: "educator" | "student" | "parent" | "administrator";
          _id: string;
        },
    type: "info" | "password"
  ) => Promise<any>;
};

function EditProfileModal(props: EditProps) {
  const FNAME_FORM_KEY = "firstName";
  const LNAME_FORM_KEY = "lastName";
  const EMAIL_FORM_KEY = "email";
  const LABEL_FORM_KEY = "label";

  const formUserSchema = userSchema.omit({ hashedPassword: true });

  const [invalidEmail, setInvalidEmail] = useState("");

  useEffect(() => {
    setInvalidEmail("");
  }, []);

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
            hashedPassword: props.userData?.hashedPassword!,
          },
          "info"
        );
        if (res.error) {
          setInvalidEmail(res.error);
        } else {
          props.setOpen(false);
          props.setUserData({
            ...parse.data,
            _id: props.userData?._id!,
            hashedPassword: props.userData?.hashedPassword!,
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
      <div className="grid grid-cols-8 gap-3 py-4 -my-2">
        <div className="items-center col-span-4">
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
            className="text-xs font-light text-black col-span-3"
          />
        </div>
        <div className="items-center col-span-4">
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
            className="text-xs font-light text-black col-span-3"
          />
        </div>
        <div className="items-center col-span-8">
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
            className={cn("text-xs font-light text-black col-span-8", {
              "border-red-500": invalidEmail !== "",
            })}
          />
          <p className="text-xs text-red-500 mt-1">{invalidEmail}</p>
        </div>

        <div className="items-center col-span-8">
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
        <div className="items-center col-span-8">
          <p
            onClick={() => props.setProfileState("changePw")}
            className="text-lg text-blue-primary font-semibold mt-2 mb-6 hover:cursor-pointer"
          >
            Change Password
          </p>
        </div>
      </div>
      <DialogFooter>
        <div className="relative w-full mt-10">
          <Button
            variant="outline2"
            className="absolute bottom-0 left-0 text-lg px-4"
            onClick={() => props.setProfileState("view")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="mainblue"
            className="absolute bottom-0 right-0 text-lg px-4"
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
