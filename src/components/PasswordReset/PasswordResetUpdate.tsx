import pageAccessHOC from "@/components/HOC/PageAccess";
import Link from "next/link";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import Image from "next/image";

interface Props {
  onSuccess: () => void;
}

function ErrorNotification({
  errorMessage,
  onClick,
}: {
  errorMessage: string | null;
  onClick: () => void;
}) {
  return (
    <div className="absolute top-[-18vh] flex w-[20%] min-w-[20em] items-center gap-2 rounded-md border-2 border-solid border-red-400 p-3">
      <img className="h-5 w-5" src="/error.svg" alt="Error Icon" />
      <div className="flex min-w-[90%] items-start justify-between">
        <span className="text-xs">
          {errorMessage ??
            "We ran into an error while updating your password. Your token might have expired or is invalid. Please try again later."}
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

function PasswordResetUpdate({ onSuccess }: Props) {
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setShowErrorNotification(false);

      const password = passwordRef.current?.value;

      const parse = z.string().min(8).safeParse(password);
      if (!parse.success) {
        setErrorMessage("Password must be at least 8 characters long");
        setShowErrorNotification(true);
        return;
      }
      const res = await fetch("/api/auth/password-reset", {
        method: "PUT",
        body: JSON.stringify({ newPassword: password }),
      });

      if (!res?.ok) {
        setShowErrorNotification(true);
        return;
      }
      onSuccess();
    },
    [onSuccess],
  );

  return (
    <div className="relative flex w-[40%] min-w-[15em] flex-col items-center gap-6">
      {showErrorNotification ? (
        <ErrorNotification
          errorMessage={errorMessage}
          onClick={() => setShowErrorNotification(false)}
        />
      ) : null}
      <h2 className="w-[100%] text-3xl font-bold text-blue-primary">
        Create New Password
      </h2>
      <form className="flex w-[100%] flex-col gap-8" onSubmit={handleSubmit}>
        <div className="relative flex flex-col">
          <label htmlFor="confirmation-code">
            <span className="text-l">New Password</span>
          </label>
          <Input
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            ref={passwordRef}
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
            Create Password
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

export default pageAccessHOC(PasswordResetUpdate);
