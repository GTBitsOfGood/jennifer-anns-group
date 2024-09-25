import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/Login/LoginForm";
import Link from "next/link";

interface Props {
  onSuccess: () => void;
}

function PasswordResetRequest({ onSuccess }: Props) {
  return (
    <div className="flex flex-col content-start gap-6">
      <div>
        <h2 className="text-3xl font-bold text-blue-primary">
          Reset Your Password
        </h2>
        <p className="text-12px">
          Enter the email address linked to your account and we&apos;ll send you
          a confirmation code.
        </p>
      </div>
      <LoginForm />
      <div className="flex flex-col items-center gap-2">
        <p>
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-primary underline hover:cursor-pointer"
          >
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default pageAccessHOC(PasswordResetRequest);
