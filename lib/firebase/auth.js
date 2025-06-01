import {
    createUserWithEmailAndPassword,
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
} from "firebase/auth";
import { auth } from "@/lib/firebase/firebasedb";

export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}

export function onIdTokenChanged(cb) {
    return _onIdTokenChanged(auth, cb);
}

export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("이메일 로그인 성공", user);
        return userCredential;
    } catch {
        if (error instanceof Error) {
            console.error("이메일 로그인 에러:", error.message);
        } else {
            console.error("알 수 없는 이메일 로그인 에러:", error);
        }
        return null;
    }
}

export async function createUser(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log("이메일 가입 성공", user);
        return userCredential;
    } catch {
        if (error instanceof Error) {
            console.error("이메일 회원가입 에러:", error.message);
        } else {
            console.error("알 수 없는 이메일 회원가입 에러:", error);
        }
        return null;
    }
}

export async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        const data = await sendIdTokenToServer(idToken);
        return data;
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
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const idToken = await user.getIdToken();

        const data = await sendIdTokenToServer(idToken);
        return data;
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
        const res = await fetch("/api/auth/login-demo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();

        if (res.ok) {
            console.log("테스트용 계정 로그인 됨");
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
    try {
        await signOut(auth);
        const res = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        console.log(data.message);
    } catch (error) {
        console.error("Error signing out", error);
    }
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
            console.log("서버 응답:", data);
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
