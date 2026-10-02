import {
    GithubAuthProvider,
    GoogleAuthProvider,
    inMemoryPersistence,
    setPersistence,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebasedb";

let clientAuthReady;

export function prepareClientAuth() {
    if (!clientAuthReady) {
        clientAuthReady = setPersistence(auth, inMemoryPersistence)
            .then(() => signOut(auth))
            .catch((error) => {
                clientAuthReady = undefined;
                throw error;
            });
    }
    return clientAuthReady;
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        await prepareClientAuth();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        try {
            return await sendIdTokenToServer(idToken);
        } finally {
            await signOut(auth);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error signing in with Google:", error.message);
        } else {
            console.error("Unknown error signing in with Google:", error);
        }
        throw error;
    }
}

export async function signInWithGithub() {
    const provider = new GithubAuthProvider();

    try {
        await prepareClientAuth();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        try {
            return await sendIdTokenToServer(idToken);
        } finally {
            await signOut(auth);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error signing in with Github:", error.message);
        } else {
            console.error("Unknown error signing in with Github:", error);
        }
        throw error;
    }
}

export async function signInDemo() {
    try {
        await prepareClientAuth();
        const res = await fetch("/api/auth/login-demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
            return data;
        } else {
            console.error("테스트용 계정 로그인 서버 에러:", data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error signing in test account:", error.message);
        } else {
            console.error("Unknown error signing in test account:", error);
        }
        throw error;
    }
}

export async function signout() {
    const res = await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    if (!res.ok) throw new Error("로그아웃에 실패했습니다");
    await signOut(auth);
}

async function sendIdTokenToServer(idToken) {
    try {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken }),
        });

        const data = await res.json();

        if (res.ok) {
            return data;
        } else {
            console.error("서버 에러:", data.error);
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("서버 통신 에러:", error);
        throw error;
    }
}
