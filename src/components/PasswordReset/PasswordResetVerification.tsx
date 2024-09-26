import pageAccessHOC from "@/components/HOC/PageAccess";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import Image from "next/image";

interface Props {
  onSuccess: () => void;
  emailRef: React.RefObject<string>;
}

function EmailSentNotification({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-[-10em] flex w-[100%] items-center gap-2 rounded-md bg-[#C6E3F9] p-3">
      <img
        className="h-5 w-5"
        src="/check_circle_outline.png"
        alt="Check Circle Icon"
      />
      <div className="flex items-start">
        <span className="text-xs">
          A confirmation code has been sent to your email address. Please check
          your inbox.
        </span>
        <Image
          src="/cross.svg"
          alt="Cross Icon"
          width={15}
          height={15}
          role="button"
          onClick={onClick}
        />
      </div>
    </div>
  );
}

function ErrorNotification({ onClick }: { onClick: () => void }) {
  return (
    <div className="absolute top-[-10em] flex w-[120%] items-center gap-2 rounded-md border-2 border-solid border-red-400 p-3">
      <img className="h-5 w-5" src="/error.svg" alt="Error Icon" />
      <div className="flex min-w-[90%] items-start justify-between">
        <span className="text-xs">
          We ran into an error while verifying your password reset token. Your
          token might have expired or is invalid. Please try again later.
        </span>
        <Image
          src="/cross.svg"
          alt="Cross Icon"
          width={15}
          height={15}
          role="button"
          onClick={onClick}
        />
      </div>
    </div>
  );
}

function PasswordResetVerification({ onSuccess, emailRef }: Props) {
  const [showEmailNotification, setShowEmailNotification] = useState(true);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const confirmationCodeRef = useRef<HTMLInputElement>(null);

  const handleLoginSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setShowEmailNotification(false);
      setShowErrorNotification(false);

      const email = emailRef.current;
      const confirmationCode = confirmationCodeRef.current?.value;

      const parse = z.string().length(6).safeParse(confirmationCode);
      if (!parse.success) {
        setShowErrorNotification(true);
        return;
      }
      const res = await fetch("/api/auth/password-reset/verify", {
        method: "POST",
        body: JSON.stringify({ email, token: confirmationCode }),
      });

      if (!res?.ok) {
        setShowErrorNotification(true);
        return;
      }
      onSuccess();
    },
    [onSuccess, emailRef],
  );

  return (
    <div className="relative flex w-[40%]  min-w-[15em] flex-col items-center gap-6">
      {showEmailNotification ? (
        <EmailSentNotification
          onClick={() => setShowEmailNotification(false)}
        />
      ) : showErrorNotification ? (
        <ErrorNotification onClick={() => setShowErrorNotification(false)} />
      ) : null}
      <div className="">
        <h2 className="text-3xl font-bold text-blue-primary">
          Reset Your Password
        </h2>
        <p className="text-xs">
          Enter the email address linked to your account and we&apos;ll send you
          a confirmation code.
        </p>
      </div>
      <form
        className="flex w-[100%] flex-col gap-8"
        onSubmit={handleLoginSubmit}
      >
        <div className="relative flex flex-col">
          <label htmlFor="confirmation-code">
            <span className="text-l">Confirmation Code</span>
            <span className="text-xs text-[#2352A0]">
              &nbsp;&nbsp;&nbsp;(Sent to your email)
            </span>
          </label>
          <Input
            name="confirmation-code"
            placeholder="Eg. 123456"
            ref={confirmationCodeRef}
            className={
              "w-[100%]" +
              (showErrorNotification
                ? "border-red-500"
                : "border-input-border focus:border-blue-primary")
            }
          />
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

export default pageAccessHOC(PasswordResetVerification);
