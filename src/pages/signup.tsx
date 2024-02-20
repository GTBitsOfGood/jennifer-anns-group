import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import CredentialSlide, {
  credentialSchema,
} from "@/components/Registration/CredentialSlide";
import InformationSlide, {
  informationSchema,
} from "@/components/Registration/InformationSlide";
import RegistrationAlert from "@/components/Registration/RegistrationAlert";
import { ADMIN_CONTACT } from "@/utils/adminConsts";
import Link from 'next/link';

import React, { useState } from "react";
import { z } from "zod";

const alertTypeMap = {
  admin: {
    title: "Your account has not been authorized",
    content: (
      <p>
        Your account has not been granted access. This site is for Jennifer
        Ann’s Group administration only. Please contact{" "}
        <strong>
          <em>{ADMIN_CONTACT}</em>{" "}
        </strong>
        for assistance if needed.
      </p>
    ),
  },
  generic: {
    title: "Failed to register your account",
    content: (
      <p>
        We were unable to register your account. This could be because of a
        technical error or because an account with your email address already
        exists.
      </p>
    ),
  },
};

export type AlertKeys = keyof typeof alertTypeMap | undefined;

export enum FormSlide {
  Credentials = 0,
  Information = 1,
}

export const accountSchema = informationSchema.merge(credentialSchema);

function Signup() {
  const [formSlide, setFormSlide] = useState<FormSlide>(FormSlide.Credentials);
  const [alertType, setAlertType] = useState<
    keyof typeof alertTypeMap | undefined
  >(undefined);
  const [isAlertShowing, setIsAlertShowing] = useState(false);
  const [accountData, setAccountData] = useState<
    Partial<Record<keyof z.infer<typeof accountSchema>, string | undefined>>
  >({
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
    firstName: undefined,
    lastName: undefined,
    label: undefined,
    age: undefined,
  });

  const formSlideComponentMap: Record<FormSlide, React.JSX.Element> = {
    [FormSlide.Credentials]: (
      <CredentialSlide
        setFormSlide={setFormSlide}
        setAccountData={setAccountData}
      />
    ),
    [FormSlide.Information]: (
      <InformationSlide
        accountData={accountData}
        setAlertType={setAlertType}
        setIsAlertShowing={setIsAlertShowing}
      />
    ),
  } as const;

  return (
    <HeroImage containerClassName="flex flex-col items-center justify-center">
      <div className="flex flex-col content-start gap-6 relative">
        {alertType !== undefined && isAlertShowing ? (
          <div className="absolute top-[-8em]">
            <RegistrationAlert
              title={alertTypeMap[alertType].title}
              setIsAlertShowing={setIsAlertShowing}
            >
              {alertTypeMap[alertType].content}
            </RegistrationAlert>
          </div>
        ) : null}
        <div>
          <h2 className="text-blue-primary text-3xl font-bold">Registration</h2>
        </div>
        <div>{formSlideComponentMap[formSlide]}</div>
        <div className="flex flex-col items-center gap-2">
          <p>
            Have an account?{" "}
            <Link
              href="/login"
              className="underline text-blue-primary hover:cursor-pointer"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </HeroImage>
  );
}

export default pageAccessHOC(Signup);
