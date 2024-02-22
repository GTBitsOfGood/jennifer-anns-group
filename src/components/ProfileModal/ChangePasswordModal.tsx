import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import cn from "classnames";
import { z } from "zod";

import React from "react";
import { useState } from "react";
import { changePWSchema } from "@/utils/types";

import {
  ProfileState,
  userDataSchema,
  EditUserParams,
  EditUserReturnValue,
} from "./ProfileModal";

type ChangePWProps = {
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  userData: z.infer<typeof userDataSchema> | undefined;
  editUser: (...args: EditUserParams) => EditUserReturnValue;
};

function ChangePasswordModal(props: ChangePWProps) {
  const OLDPW_FORM_KEY = "oldpassword";
  const PW_FORM_KEY = "password";
  const PW_CONFIRM_FORM_KEY = "passwordConfirm";

  const pwSchema = changePWSchema.refine(
    (data) => data.password === data.passwordConfirm,
    {
      message: "Passwords do not match",
      path: ["passwordConfirm"],
    },
  );

  const [invalidFields, setInvalidFields] = useState({
    password: "",
    passwordConfirm: "",
    oldPassword: "",
  });

  type FormKey = "password" | "passwordConfirm" | "oldPassword";

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

  async function handlePasswordFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      oldpassword: formData.get(OLDPW_FORM_KEY),
      password: formData.get(PW_FORM_KEY),
      passwordConfirm: formData.get(PW_CONFIRM_FORM_KEY),
    };
    const parse = pwSchema.safeParse(input);
    if (parse.success) {
      resetErrorMessage("password");
      resetErrorMessage("passwordConfirm");
      try {
        const res = await props.editUser(
          parse.data,
          "password",
          props.userData?._id!,
        );
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
      <div className="-my-2 grid grid-cols-8 gap-6 py-4">
        <div className="col-span-8 items-center">
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
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500": invalidFields.oldPassword !== "",
            })}
          />

          <p className="mt-1 text-xs text-red-500">
            {invalidFields.oldPassword}
          </p>
        </div>
        <div className="col-span-8 items-center">
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
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500": invalidFields.password !== "",
            })}
          />
          <p className="mt-1 text-xs text-red-500">{invalidFields.password}</p>
        </div>
        <div className="col-span-8 items-center">
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
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500": invalidFields.passwordConfirm !== "",
            })}
          />
          <p className="mt-1 text-xs text-red-500">
            {invalidFields.passwordConfirm}
          </p>
        </div>
      </div>

      <DialogFooter>
        <div className="relative mt-16 w-full">
          <Button
            type="submit"
            variant="mainblue"
            className="absolute bottom-0 right-0 px-4 text-lg"
          >
            Save Password
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default ChangePasswordModal;
