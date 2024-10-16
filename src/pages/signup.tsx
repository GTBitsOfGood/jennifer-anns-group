import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import CredentialSlide, {
  credentialSchema,
} from "@/components/Registration/CredentialSlide";
import EmailVerificationSlide from "@/components/Registration/EmailVerificationSlide";
import InformationSlide, {
  informationSchema,
} from "@/components/Registration/InformationSlide";
import RegistrationAlert from "@/components/Registration/RegistrationAlert";
import { ADMIN_CONTACT } from "@/utils/consts";
import Link from "next/link";

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
  Credentials,
  EmailVerification,
  Information,
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
        onSuccess={() => setFormSlide(FormSlide.EmailVerification)}
        setAccountData={setAccountData}
      />
    ),
    [FormSlide.EmailVerification]: (
      <EmailVerificationSlide
        email={accountData.email ?? ""}
        onSuccess={() => setFormSlide(FormSlide.Information)}
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
      <div className="relative flex flex-col content-start gap-6">
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
          <h2 className="text-3xl font-bold text-blue-primary">Registration</h2>
        </div>
        <div>{formSlideComponentMap[formSlide]}</div>
        <div className="flex flex-col items-center gap-2">
          <p>
            Have an account?{" "}
            <Link
              href="/login"
              className="text-blue-primary underline hover:cursor-pointer"
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
