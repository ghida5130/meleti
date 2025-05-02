import NextAuth from "next-auth";
// import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { db } from "./firebase/firebasedb";
import { doc, getDoc, setDoc } from "firebase/firestore";

// import { hashPassword } from "./utils/password";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [GitHub, Google],
    session: {
        strategy: "jwt",
        maxAge: 3 * 60 * 60, // 3시간
    },
    jwt: {
        maxAge: 3 * 60 * 60, // 3시간
    },
    callbacks: {
        async signIn({ user, account }) {
            if (!user.email) return false;

            const userRef = doc(db, "users", user.email);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    name: user.name,
                    image: user.image || "",
                    provider: account?.provider,
                    createdAt: new Date(),
                });
            }
            return true;
        },
    },
    events: {
        async signIn({ user, account, profile }) {
            console.log(user.name, user.email, account?.provider, profile?.exp);
        },
    },
});
