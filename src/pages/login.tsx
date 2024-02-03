import styles from "@/styles/login.module.css";
import Image from "next/image";
import jenn from "@/images/jenn-ann.png";
import error from "@/images/Vectorerror.png";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";
export default function login() {
  const [email, setEmail] = useState<string>("");
  const [badEmail, setBadEmail] = useState<string>("");
  const [badPassword, setBadPassword] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const emailTemplateRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    //Changes color of an element.
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (!emailInput || !passwordInput) {
      return;
    }
    if (badEmail !== "") {
      emailInput.style.borderColor = "red";
    } else {
      emailInput.style.borderColor = "black";
    }
    if (badPassword !== "") {
      passwordInput.style.borderColor = "red";
    } else {
      passwordInput.style.borderColor = "black";
    }
  }, [badEmail, badPassword]);
  return (
    <div className={styles.body}>
      <div className={styles.leftContent}>
        <div className={styles.leftTitle}>
          JENNIFER <br></br>ANN'S GROUP
        </div>
        <div className={styles.leftDescription}>
          LIFE. LOVE. <Image alt="Logo" className={styles.logo} src={jenn} />{" "}
        </div>
      </div>

      <div className={styles.rightContent}>
        <div className={styles.rightIntro}>
          Welcome to <br></br> <h1>Jennifer Ann's Group</h1>
        </div>

        <div className={styles.loginBox}>
          Email <br></br>
          <input
            className={styles.inputBox}
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          ></input>
          {badEmail ? (
            <div className={styles.errorMessage}>
              <Image className={styles.errorImage} alt="error" src={error} />
              {badEmail}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <div className={styles.loginBox}>
          Password <br></br>
          <input
            className={styles.inputBox}
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min 8 Characters"
          ></input>
          {badPassword ? (
            <div className={styles.errorMessage}>
              <Image className={styles.errorImage} alt="error" src={error} />
              {badPassword}
            </div>
          ) : (
            <div></div>
          )}
        </div>
        <a className={styles.forgotPassword} href="https://www.google.com/">
          Forgot Password?
        </a>
        <button
          className={styles.logIn}
          onClick={async (e) => {
            //Use document.getElementById("email")
            e.preventDefault();
            //Whether email or password is present.
            if (!email) {
              setBadEmail("No email provided");
              setBadPassword("");
            }
            if (!password) {
              setBadPassword("No password provided");
              setBadEmail("");
            }
            if (!email && !password) {
              setBadEmail("No email provided");
              setBadPassword("No password provided");
            }
            if (!email || !password) {
              return;
            }
            //Ensuring email is an email
            if (!emailTemplateRegex.test(email)) {
              setBadEmail("Email is not in a valid format");
              setBadPassword("");
              return;
            }
            //Ensuring password is 8 chars
            if (password.length < 8) {
              setBadEmail("");
              setBadPassword("Password is too short");
              return;
            }

            const result = await signIn("credentials", {
              email: email,
              password: password,
              redirect: false,
            });
            if (result?.error === null) {
              router.push("/");
            } else if (result?.error === "Email Not Found") {
              setBadEmail("Sorry, we couldn't find an account with this email");
              setBadPassword("");
            } else {
              setBadPassword("Incorrect Password");
              setBadEmail("");
            }
          }}
        >
          Log In
        </button>
        <div className={styles.signupBox}>
          Dont have an account?{" "}
          <a href="/signup" className={styles.signup}>
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
}
