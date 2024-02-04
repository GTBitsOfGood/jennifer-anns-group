import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { FormSlide, accountSchema } from "@/pages/signup";

const EMAIL_FORM_KEY = "email";
const PASSWORD_FORM_KEY = "password";
const PASSWORD_CONFIRM_FORM_KEY = "passwordConfirm";

export const credentialSchema = z.object({
  email: z.string().email("Not a valid email."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
  passwordConfirm: z.string(),
});

export const passwordConfirmValidation = (schema: typeof credentialSchema) =>
  schema.refine((val) => val.password === val.passwordConfirm, {
    path: [PASSWORD_CONFIRM_FORM_KEY],
    message: "Passwords do not match.",
  });

const validatedCredentialSchema = passwordConfirmValidation(credentialSchema);

interface Props {
  setFormSlide: React.Dispatch<React.SetStateAction<FormSlide>>;
  setAccountData: React.Dispatch<
    React.SetStateAction<
      Partial<Record<keyof z.infer<typeof accountSchema>, string | undefined>>
    >
  >;
}

function CredentialSlide({ setFormSlide, setAccountData }: Props) {
  const [validationErrors, setValidationErrors] = useState<
    Record<keyof z.input<typeof validatedCredentialSchema>, string | undefined>
  >({
    email: undefined,
    password: undefined,
    passwordConfirm: undefined,
  });

  function handleCredentialFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      email: formData.get(EMAIL_FORM_KEY),
      password: formData.get(PASSWORD_FORM_KEY),
      passwordConfirm: formData.get(PASSWORD_CONFIRM_FORM_KEY),
    };
    const parse = validatedCredentialSchema.safeParse(input);
    if (parse.success) {
      setAccountData(parse.data);
      setFormSlide(FormSlide.Information);
    } else {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        email: errors.email?.at(0),
        password: errors.password?.at(0),
        passwordConfirm: errors.passwordConfirm?.at(0),
      });
    }
  }

  return (
    <form
      className="flex flex-col gap-8 w-[20em]"
      onSubmit={handleCredentialFormSubmit}
    >
      <div className="flex flex-col relative">
        <label htmlFor={EMAIL_FORM_KEY} className="text-xl">
          Email*
        </label>
        <Input
          name={EMAIL_FORM_KEY}
          placeholder="Email"
          className={
            validationErrors.email
              ? "border-red-500"
              : "border-input-border focus:border-blue-primary"
          }
        />
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.email}
        </p>
      </div>
      <div className="flex flex-col relative">
        <label htmlFor={PASSWORD_FORM_KEY} className="text-xl">
          Password*
        </label>
        <Input
          name={PASSWORD_FORM_KEY}
          placeholder="Min. 8 characters"
          type="password"
          className={
            validationErrors.password
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-input-border focus:border-blue-primary"
          }
        />
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.password}
        </p>
      </div>
      <div className="flex flex-col relative">
        <label htmlFor={PASSWORD_CONFIRM_FORM_KEY} className="text-xl">
          Confirm Password*
        </label>
        <Input
          name={PASSWORD_CONFIRM_FORM_KEY}
          placeholder="Min. 8 characters"
          type="password"
          className={
            validationErrors.passwordConfirm
              ? "border-red-500 focus-visible:ring-red-500"
              : "border-input-border focus:border-blue-primary"
          }
        />
        <p className="absolute bottom-[-2em] text-xs text-red-500">
          {validationErrors.passwordConfirm}
        </p>
      </div>
      <div className="flex flex-row justify-center">
        <Button type="submit" variant="outline" size="lg">
          Continue
        </Button>
      </div>
    </form>
  );
}

export default CredentialSlide;
