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
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Error signing in with Google", error);
    }
}

export async function signInWithGithub() {
    const provider = new GithubAuthProvider();

    try {
        await signInWithPopup(auth, provider);
        // const credential = GithubAuthProvider.credentialFromResult(result);
        // const token = credential?.accessToken;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error signing in with Github:", error.message);
        } else {
            console.error("Unknown error signing in with Github:", error);
        }
    }
}

export async function signout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out", error);
    }
}
