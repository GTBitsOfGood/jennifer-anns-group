import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/Login/LoginForm";
import Link from "next/link";

function Login() {
  return (
    <HeroImage containerClassName="flex flex-col items-center justify-center">
      <div className="flex flex-col content-start gap-6">
        <div>
          <h2 className="text-3xl font-light text-blue-primary">Welcome to</h2>
          <h2 className="text-3xl font-bold text-blue-primary">
            Jennifer Ann&apos;s Group
          </h2>
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
    </HeroImage>
  );
}

export default pageAccessHOC(Login);
