"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase/firebasedb";

export default function Userinfo() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
            } else {
                setUser(null);
            }
        });

        // cleanup
        return () => unsubscribe();
    }, []);

    if (user) {
        return (
            <div>
                로그인됨: {user.displayName} {user.email}
            </div>
        );
    }

    return <div>로그인 안 됨</div>;
}
