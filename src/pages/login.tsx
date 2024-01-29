import styles from "@/styles/login.module.css";
import Image from 'next/image';
import jenn from "@/images/jenn-ann.png";
export default function login() {
    return <div className={styles.body}>
        <div className={styles.leftContent}>

            <div className={styles.leftTitle}>JENNIFER <br></br>ANN'S GROUP</div>
            <div className={styles.leftDescription}>LIFE. LOVE. <Image alt="Logo" className={styles.logo}src={jenn}/> </div>
        </div>

        <div className={styles.rightContent}>

            <div className={styles.rightIntro}>Welcome to <br></br> <h1>Jennifer Ann's Group</h1></div>
            
            <div className={styles.loginBox}>
                Email <br></br>
                <input className={styles.inputBox} type="text" id="email" placeholder="Email"></input>
            </div>
            <div className={styles.loginBox}>
                Password <br></br>
                <input className={styles.inputBox} type="password" id="password" placeholder="Min 8 Characters"></input>
            </div>
                <a className={styles.forgotPassword} href="https://www.google.com/">Forgot Password?</a>
                <button className={styles.logIn}>Log In</button>
                <div className={styles.signupBox}>Dont have an account? <a href="/signup"className={styles.signup}>Sign up now</a><br></br><a href="/signup-admin"className={styles.signup}> Adminstrator?</a>
                </div>
        </div>
    </div>
}