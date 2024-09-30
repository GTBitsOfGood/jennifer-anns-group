import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useRef, useState } from "react";
import { z } from "zod";
import ErrorNotification from "../PasswordReset/ErrorNotification";
import EmailSentNotification from "../PasswordReset/EmailSentNotification";

interface Props {
  onSuccess: () => void;
  email: string;
}

export default function EmailVerificationSlide({ onSuccess, email }: Props) {
  const [showEmailNotification, setShowEmailNotification] = useState(true);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const confirmationCodeRef = useRef<HTMLInputElement>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setShowEmailNotification(false);
      setShowErrorNotification(false);

      const confirmationCode = confirmationCodeRef.current?.value;

      const parse = z.string().length(6).safeParse(confirmationCode);
      if (!parse.success) {
        setShowErrorNotification(true);
        return;
      }
      const res = await fetch("/api/auth/email-verification/verify", {
        method: "POST",
        body: JSON.stringify({ email, token: confirmationCode }),
      });

      if (!res?.ok) {
        setShowErrorNotification(true);
        return;
      }
      onSuccess();
    },
    [onSuccess, email],
  );

  return (
    <div className="flex flex-col items-center gap-6">
      {showEmailNotification ? (
        <EmailSentNotification
          onClick={() => setShowEmailNotification(false)}
        />
      ) : showErrorNotification ? (
        <ErrorNotification
          errorMessage="We ran into an error while verifying your email verification token. Your
          token might have expired or is invalid. Please try again later."
          onClick={() => setShowErrorNotification(false)}
        />
      ) : null}

      <form className="flex w-[100%] flex-col gap-8" onSubmit={handleSubmit}>
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
    </div>
  );
}
