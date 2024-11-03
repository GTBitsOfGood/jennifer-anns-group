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
import { Check } from "lucide-react";

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

  const [verificationState, setVerificationState] = useState("");
  //Condense , no email changed (null) emailChanged,verification_being_sent,verificationSent, verified, to one state.
  // "", email-changed, sending, sent, verified.
  const [trackedChecked, setTrackedChecked] = useState<boolean>(
    props.userData?.tracked ?? false,
  );

  useEffect(() => {
    setTrackedChecked(props.userData?.tracked ?? false);
  }, [props.userData?.tracked]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (e.target.value !== props.userData?.email) {
      setVerificationState("email-changed");
    } else {
      setVerificationState("");
    }
    setInvalidEmail("");
  };
  const sendVerification = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    //Call api to send verification
    setVerificationState("sending");
    const res = await fetch("/api/auth/email-verification/create", {
      method: "POST",
      body: JSON.stringify({ email: email }),
    });
    const json = await res.json();
    if (res?.ok) {
      setVerificationState("sent");
      setInvalidEmail("");
    } else {
      setVerificationState("email-changed");
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
      setVerificationState("verified");
      setInvalidEmail("");
    } else {
      //Incorrect verification code
      setVerificationState("sent");
      setInvalidEmail(
        'Code verification failed. Re-enter code or click "Cancel" to try again. ',
      );
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
      <div className="grid grid-cols-8 gap-3">
        <div className="col-span-4 items-center">
          <Label
            htmlFor={FNAME_FORM_KEY}
            className="text-right text-base font-normal"
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
            className="text-right text-base font-normal"
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
            className="text-right text-base font-normal"
          >
            Email
          </Label>
          <Input
            name={EMAIL_FORM_KEY}
            id="email"
            defaultValue={email}
            autoComplete="email"
            onChange={handleEmailChange}
            disabled={
              verificationState !== "" && verificationState !== "email-changed"
            }
            className={cn("col-span-8 text-xs font-light text-black", {
              "border-red-500":
                invalidEmail !== "" && verificationState == "email-changed",
            })}
          />
          <div className="mt-1 flex gap-1">
            {verificationState == "email-changed" && (
              <Button
                variant="outline"
                className="flex-grow px-4 text-black"
                onClick={sendVerification}
              >
                Send Verification Code
              </Button>
            )}
          </div>
          <div className="mt-1 flex gap-1">
            {verificationState == "sending" && (
              <Label className="flex-grow rounded border  bg-gray-100 p-3 text-center font-normal">
                Sending code...
              </Label>
            )}
          </div>

          {verificationState == "sent" && (
            <div className="flex justify-between gap-2">
              <Input
                name={VERIFICATION_CODE_KEY}
                ref={confirmationCodeRef}
                placeholder="Enter code"
                className="col-span-8 w-max text-xs font-light text-black"
              />
              <Button
                variant="mainblue"
                className="flex-shrink-0 px-4"
                onClick={checkVerification}
              >
                Verify
              </Button>
            </div>
          )}
          {verificationState == "verified" && (
            <div className="mt-1 flex items-center gap-1 text-blue-primary">
              <Check size={20} />
              <p className="text-xs ">Code verification successful</p>
            </div>
          )}

          <div className="mt-1 flex gap-1">
            {invalidEmail && <WarningIcon />}
            <p className="text-xs text-red-500">{invalidEmail}</p>
          </div>
        </div>

        <div className="col-span-8 items-center">
          <Label className="text-right text-base font-normal">Role</Label>
          <p className="col-span-3 py-2 text-sm font-light text-blue-primary">
            {props.userData?.label
              ? props.userData?.label.charAt(0).toUpperCase() +
                props.userData?.label.slice(1)
              : ""}
          </p>
        </div>
        <div className="col-span-8 items-center">
          <p
            onClick={() => props.setProfileState("changePw")}
            className="text-base font-semibold text-blue-primary hover:cursor-pointer"
          >
            Change Password
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
      </div>
      <DialogFooter>
        <div className="relative mt-10 flex w-full gap-4">
          <Button
            variant="outline2"
            className=" flex-grow px-4 text-lg"
            onClick={() => props.setProfileState("view")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="mainblue"
            className=" flex-grow px-4 text-lg"
            onClick={() => props.setProfileState("edit")}
          >
            Save
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}

export default EditProfileModal;
