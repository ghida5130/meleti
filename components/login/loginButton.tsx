import styles from "@/styles/login.module.scss";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";
import { signInDemo, signInWithGithub, signInWithGoogle } from "@/lib/firebase/auth";

interface LoginButtonProps {
    provider: "google" | "github" | "demo";
}

export default function LoginButton({ provider }: LoginButtonProps) {
    const { setUserData } = useUserData();

    const handleLogin = async () => {
        try {
            const signInFn =
                provider === "google" ? signInWithGoogle : provider === "github" ? signInWithGithub : signInDemo;

            const data = await signInFn();
            console.log(data.userImage);
            setUserData({
                accessToken: data.accessToken,
                name: data.name,
                email: data.email,
                userImage: data.userImage,
                expiresIn: Date.now() + 15 * 60 * 1000,
            });
            window.location.href = "/";
        } catch (err) {
            console.log("로그인 실패 : ", err);
        }
    };

    const getLabel = () => {
        switch (provider) {
            case "google":
                return "Google로 로그인";
            case "github":
                return "GitHub로 로그인";
            case "demo":
                return "테스트 계정으로 로그인";
        }
    };

    return (
        <button onClick={handleLogin} className={styles.btn}>
            {getLabel()}
        </button>
    );
}
