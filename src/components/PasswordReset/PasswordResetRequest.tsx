import pageAccessHOC from "@/components/HOC/PageAccess";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import { z } from "zod";

interface Props {
  onSuccess: () => void;
  emailRef: React.MutableRefObject<string>;
}

function PasswordResetRequest({ onSuccess, emailRef }: Props) {
  const [validationError, setValidationError] = useState<string | null>(null);
  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setValidationError(null);

      const email = emailRef.current;
      const parse = z.string().email().safeParse(email);
      if (!parse.success) {
        setValidationError("Invalid email provided");
        return;
      }
      const res = await fetch("/api/auth/password-reset/create", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      const json = await res.json();
      if (!res?.ok) {
        setValidationError(json.error);
        return;
      }
      onSuccess();
    },
    [onSuccess, emailRef],
  );

  return (
    <div className="flex w-[40%]  min-w-[15em] flex-col items-center gap-6">
      <div className="">
        <h2 className="text-3xl font-bold text-blue-primary">
          Reset Your Password
        </h2>
        <p className="text-xs">
          Enter the email address linked to your account and we&apos;ll send you
          a confirmation code.
        </p>
      </div>
      <form className="flex w-[100%] flex-col" onSubmit={handleSubmit}>
        <div className="relative flex flex-col">
          <label htmlFor="email" className="text-l">
            Email*
          </label>
          <Input
            name="email"
            placeholder="Email"
            className={
              "w-[100%]" +
              (validationError
                ? "border-red-500"
                : "border-input-border focus:border-blue-primary")
            }
            onChange={(e) => (emailRef.current = e.target.value)}
          />
          <p className="py-2 text-xs text-red-500">
            {validationError}
          </p>
        </div>
        <div className="flex flex-row justify-center">
          <Button
            className="w-[100%]"
            type="submit"
            variant="outline"
            size="lg"
          >
            Send Confirmation Code
          </Button>
        </div>
      </form>
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
  );
}

export default pageAccessHOC(PasswordResetRequest);
