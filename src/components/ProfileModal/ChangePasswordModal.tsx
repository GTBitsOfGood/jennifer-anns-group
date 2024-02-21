import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { z } from "zod";
import cn from "classnames";

import React from "react";
import { useState, useEffect } from "react";

type ChangePWProps = {
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

function ChangePasswordModal(props: ChangePWProps) {
  const OLDPW_FORM_KEY = "oldpassword";
  const PW_FORM_KEY = "password";
  const PW_CONFIRM_FORM_KEY = "passwordConfirm";

  const pwSchema = z
    .object({
      email: z.string().email(),
      oldpassword: z.string(),
      password: z
        .string()
        .min(8, "Password must contain at least 8 characters."),
      passwordConfirm: z.string(),
    })
    .refine((data) => data.password === data.passwordConfirm, {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    });

  const [invalidFields, setInvalidFields] = useState({
    email: "",
    password: "",
    passwordConfirm: "",
    oldPassword: "",
  });

  type FormKey = "email" | "password" | "passwordConfirm" | "oldPassword";

  function resetErrorMessage(field: FormKey) {
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: "",
    }));
  }
  function setErrorMessage(field: FormKey, data: string) {
    setInvalidFields((prevInvalidFields) => ({
      ...prevInvalidFields,
      [field]: data,
    }));
  }

  useEffect(() => {
    setInvalidFields({
      email: "",
      password: "",
      passwordConfirm: "",
      oldPassword: "",
    });
  }, []);

  async function handlePasswordFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      email: props.userData?.email,
      oldpassword: formData.get(OLDPW_FORM_KEY),
      password: formData.get(PW_FORM_KEY),
      passwordConfirm: formData.get(PW_CONFIRM_FORM_KEY),
    };
    const parse = pwSchema.safeParse(input);
    if (parse.success) {
      resetErrorMessage("password");
      resetErrorMessage("passwordConfirm");
      try {
        const res = await props.editUser(parse.data, "password");
        if (res.error) {
          setErrorMessage("oldPassword", res.error);
        } else {
          props.setProfileState("edit");
          resetErrorMessage("oldPassword");
        }
      } catch (error) {
        console.error("Error editing user:", error);
      }
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      if (errors.password) {
        setErrorMessage("password", errors.password[0]);
      } else {
        resetErrorMessage("password");
      }
      if (errors.passwordConfirm) {
        setErrorMessage("passwordConfirm", errors.passwordConfirm[0]);
      } else {
        resetErrorMessage("passwordConfirm");
      }
    }
  }
  return (
    <form onSubmit={handlePasswordFormSubmit}>
      <div className="grid grid-cols-8 gap-6 py-4 -my-2">
        <div className="items-center col-span-8">
          <Label
            htmlFor={OLDPW_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            Old Password
          </Label>

          <Input
            name={OLDPW_FORM_KEY}
            type="password"
            id={OLDPW_FORM_KEY}
            defaultValue=""
            className={cn("text-xs font-light text-black col-span-8", {
              "border-red-500": invalidFields.oldPassword !== "",
            })}
          />

          <p className="text-xs text-red-500 mt-1">
            {invalidFields.oldPassword}
          </p>
        </div>
        <div className="items-center col-span-8">
          <Label
            htmlFor={PW_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            New Password
          </Label>

          <Input
            name={PW_FORM_KEY}
            type="password"
            placeholder="Min. 8 characters"
            id={PW_FORM_KEY}
            defaultValue=""
            className={cn("text-xs font-light text-black col-span-8", {
              "border-red-500": invalidFields.password !== "",
            })}
          />
          <p className="text-xs text-red-500 mt-1">{invalidFields.password}</p>
        </div>
        <div className="items-center col-span-8">
          <Label
            htmlFor={PW_CONFIRM_FORM_KEY}
            className="text-right text-lg font-normal"
          >
            Confirm New Password
          </Label>

          <Input
            name={PW_CONFIRM_FORM_KEY}
            id={PW_CONFIRM_FORM_KEY}
            defaultValue=""
            type="password"
            placeholder="Min. 8 characters"
            className={cn("text-xs font-light text-black col-span-8", {
              "border-red-500": invalidFields.passwordConfirm !== "",
            })}
          />
          <p className="text-xs text-red-500 mt-1">
            {invalidFields.passwordConfirm}
          </p>
        </div>
      </div>

      <DialogFooter>
        <div className="w-full relative mt-16">
          <Button
            type="submit"
            variant="mainblue"
            className="absolute right-0 bottom-0 text-lg px-4"
          >
            Save Password
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default ChangePasswordModal;
