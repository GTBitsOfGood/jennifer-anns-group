import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import WarningIcon from "@/components/ui/icons/warningicon";
import { userSchema } from "@/utils/types";
import cn from "classnames";
import { z } from "zod";
import React, { useEffect, useState, useRef } from "react";
import {
  ProfileState,
  userDataSchema,
  EditUserParams,
  EditUserReturnValue,
} from "./ProfileModal";
import { set } from "mongoose";

const formUserSchema = userSchema.omit({ hashedPassword: true, notes: true });

type EditProps = {
  setProfileState: React.Dispatch<React.SetStateAction<ProfileState>>;
  userData: z.infer<typeof userDataSchema> | undefined;
  setUserData: React.Dispatch<
    React.SetStateAction<z.infer<typeof userDataSchema> | undefined>
  >;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editUser: (...args: EditUserParams) => EditUserReturnValue;
  setPrivacyPolicyModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditProfileModal(props: EditProps) {
  const FNAME_FORM_KEY = "firstName";
  const LNAME_FORM_KEY = "lastName";
  const EMAIL_FORM_KEY = "email";
  const TRACKING_FORM_KEY = "tracking";
  const VERIFICATION_CODE_KEY = "verification_code";

  const confirmationCodeRef = useRef<HTMLInputElement>(null);
  const [invalidEmail, setInvalidEmail] = useState("");
  const [email, setEmail] = useState(props.userData?.email);
  const [emailChanged, setEmailChanged] = useState(false);
  const [emailChangeLocked, setEmailChangeLocked] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [trackedChecked, setTrackedChecked] = useState<boolean>(
    props.userData?.tracked ?? false,
  );

  useEffect(() => {
    setTrackedChecked(props.userData?.tracked ?? false);
  }, [props.userData?.tracked]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailChanged(e.target.value !== props.userData?.email);
    setInvalidEmail("");
  };
  const sendVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //Call api to send verification
    const res = await fetch("/api/auth/email-verification/create", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });
    const json = await res.json();
    if (res?.ok) {
      setVerificationSent(true);
      setEmailChangeLocked(true);
      setInvalidEmail("");
    } else {
      if (json.message) {
        setInvalidEmail(json.message);
      } else {
        setInvalidEmail("Something went Wrong.");
      }

      //Set vall errors
    }
  };
  const checkVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth/email-verification/verify", {
      method: "POST",
      body: JSON.stringify({
        email,
        token: confirmationCodeRef.current?.value,
      }),
    });
    console.log(res?.ok);
    if (res?.ok) {
      setVerified(true);
      setInvalidEmail("");
    } else {
      //Incorrect verification code
      setInvalidEmail("Invalid code");
    }
  };

  async function handleProfileFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      firstName: formData.get(FNAME_FORM_KEY),
      lastName: formData.get(LNAME_FORM_KEY),
      email: email,
      label: props.userData?.label,
      tracked: formData.get(TRACKING_FORM_KEY) === "on",
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
        if (input.email == "") {
          setInvalidEmail("Email cannot be empty");
        } else {
          setInvalidEmail(String(errors.email.at(0)));
        }
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
            defaultValue={email}
            autoComplete="email"
            onChange={handleEmailChange}
            disabled={emailChangeLocked}
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500": invalidEmail !== "",
            })}
          />
          <div className="mt-1 flex gap-1">
            {invalidEmail && <WarningIcon />}
            <p className="text-xs text-red-500">{invalidEmail}</p>
          </div>
          <div className="mt-1 flex gap-1">
            {emailChanged && !verificationSent && !verified && (
              <Button
                variant="outline2"
                className="px-4"
                onClick={sendVerification}
              >
                Send Verification Code to <br />
                {email}?
              </Button>
            )}
          </div>
          <div className="mt-1 flex gap-1">
            {verificationSent && !verified && (
              <div>
                <Label
                  htmlFor={EMAIL_FORM_KEY}
                  className="text-right text-lg font-normal"
                >
                  Verification Code:
                </Label>
                <Input
                  name={VERIFICATION_CODE_KEY}
                  ref={confirmationCodeRef}
                  autoComplete="Verification Code"
                  className={cn("col-span-8 text-xs font-light text-black", {
                    "": verificationSent,
                  })}
                />
                <Button
                  variant="outline2"
                  className="px-4"
                  onClick={checkVerification}
                >
                  Submit Code?
                </Button>
              </div>
            )}
          </div>
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
          <input
            name={TRACKING_FORM_KEY}
            type="checkbox"
            checked={trackedChecked}
            onChange={(e) => setTrackedChecked(e.target.checked)}
          />
          <Label
            htmlFor={TRACKING_FORM_KEY}
            className={`ml-3 text-right text-sm font-normal`}
          >
            I would like my data to help improve this site (Optional).
            {/* Learn more about Jennifer Ann&apos;s{" "}
            <span
              onClick={() => props.setPrivacyPolicyModalOpen(true)}
              className={`text-blue-primary underline`}
            >
              privacy policy
            </span> */}
          </Label>
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
