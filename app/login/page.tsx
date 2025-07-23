import styles from "@/styles/login.module.scss";

// components
import LoginButtonGroup from "@/components/login/loginButtonGroup";

export const metadata = {
    title: "Meleti 로그인",
};

export default function Login() {
    return (
        <div className={styles.wrap}>
            <p>로그인하고 나만의 독서 일기를 작성해보세요</p>
            <LoginButtonGroup />
        </div>
    );
}
