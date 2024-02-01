import HeroImage from "@/components/HeroImage";
import CredentialSlide, {
  credentialSchema,
} from "@/components/Registration/CredentialSlide";
import InformationSlide, {
  informationSchema,
} from "@/components/Registration/InformationSlide";

import React, { useState } from "react";
import { z } from "zod";

export enum FormSlide {
  Credentials = 0,
  Information = 1,
}

export const accountSchema = informationSchema.merge(credentialSchema);

function Signup() {
  const [formSlide, setFormSlide] = useState<FormSlide>(FormSlide.Credentials);

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
    [FormSlide.Information]: <InformationSlide accountData={accountData} />,
  } as const;

  return (
    <HeroImage containerClassName="flex flex-col items-center justify-center">
      <div className="flex flex-col content-start gap-6">
        <div>
          <h2 className="text-blue-primary text-4xl font-bold">Registration</h2>
        </div>
        <div>{formSlideComponentMap[formSlide]}</div>
        <div className="flex flex-col items-center gap-2">
          <p>
            Have an account?{" "}
            <a
              href="/login"
              className="underline text-blue-primary hover:cursor-pointer"
            >
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </HeroImage>
  );
}

export default Signup;
