import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import LoginForm from "@/components/Login/LoginForm";

function Login() {
  return (
    <HeroImage containerClassName="flex flex-col items-center justify-center">
      <div className="flex flex-col content-start gap-6">
        <div>
          <h2 className="text-blue-primary text-3xl font-light">Welcome to</h2>
          <h2 className="text-blue-primary text-3xl font-bold">
            Jennifer Ann&apos;s Group
          </h2>
        </div>
        <LoginForm />
        <div className="flex flex-col items-center gap-2">
          <p>
            Don&apos;t have an account?{" "}
            <a
              href="/signup"
              className="underline text-blue-primary hover:cursor-pointer"
            >
              Sign up now
            </a>
          </p>
        </div>
      </div>
    </HeroImage>
  );
}

export default pageAccessHOC(Login);
