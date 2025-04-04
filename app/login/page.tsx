import styles from "@/styles/login.module.scss";
import { signIn } from "@/auth";

export default function Login() {
    return (
        <div className={styles.wrap}>
            <p>로그인하고 나만의 독서 일기를 작성해보세요</p>
            <form
                action={async () => {
                    "use server";
                    await signIn("google", { redirectTo: "/mypage" });
                }}
            >
                <button className={styles.btn} type="submit">
                    Google 로그인
                </button>
            </form>
            <form
                action={async () => {
                    "use server";
                    await signIn("github", { redirectTo: "/mypage" });
                }}
            >
                <button className={styles.btn} type="submit">
                    Github 로그인
                </button>
            </form>
        </div>
    );
}
