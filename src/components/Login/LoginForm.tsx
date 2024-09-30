import React, { useState } from "react";
import { z } from "zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Link from "next/link";

const EMAIL_FORM_KEY = "email";
const PASSWORD_FORM_KEY = "password";

export const loginSchema = z.object({
  email: z.string().email("Not a valid email."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

function LoginForm() {
  const router = useRouter();

  const [validationErrors, setValidationErrors] = useState<
    Record<keyof z.input<typeof loginSchema>, string | undefined>
  >({
    email: undefined,
    password: undefined,
  });

  async function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const input = {
      email: formData.get(EMAIL_FORM_KEY),
      password: formData.get(PASSWORD_FORM_KEY),
    };
    const parse = loginSchema.safeParse(input);
    if (!parse.success) {
      const errors = parse.error.formErrors.fieldErrors;
      setValidationErrors({
        email: errors.email?.at(0),
        password: errors.password?.at(0),
      });
      return;
    }
    const res = await signIn("credentials", {
      ...parse.data,
      redirect: false,
    });
    // this is a potential security problem as the response is handled on the client, allowing for
    // user enumeration

    if (!res?.ok) {
      setValidationErrors({
        email: "Invalid email/password combination",
        password: "Invalid email/password combination",
      });
      return;
    }

    setValidationErrors({
      email: undefined,
      password: undefined,
    });
    router.replace("/");
  }

  return (
    <form className="flex w-[20em] flex-col gap-8" onSubmit={handleLoginSubmit}>
      <div className="relative flex flex-col">
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
      <div className="relative flex flex-col">
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
      <div className="flex flex-row justify-end">
        <Link
          className="text-sm font-light text-blue-primary hover:cursor-pointer"
          href="/password-reset"
        >
          Forgot Password?
        </Link>
      </div>
      <div className="flex flex-row justify-center">
        <Button type="submit" variant="outline" size="lg">
          Log In
        </Button>
      </div>
    </form>
  );
}

export default LoginForm;
