"use client";

import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/firebasedb";

export default function Testpage() {
    const handleLogin = async () => {
        try {
            const githubProvider = new GithubAuthProvider();

            const result = await signInWithPopup(auth, githubProvider);
            const credential = GithubAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;
            const user = result.user;

            console.log("로그인 성공", user);
            console.log("GitHub Access Token", token);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("로그인 에러", error.message);
            } else {
                console.error("알 수 없는 에러", error);
            }
        }
    };

    return <button onClick={handleLogin}>GitHub로 로그인</button>;
}
