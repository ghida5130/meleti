"use client";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";
import { signout } from "@/lib/firebase/auth";

export default function LogoutButton() {
    const { clearUserData } = useUserData();

    const handleLogout = async () => {
        try {
            await signout();
            clearUserData();
            window.location.href = "/login";
        } catch (error) {
            console.error("로그아웃 실패:", error);
        }
    };

    return (
        <li>
            <button onClick={handleLogout}>로그아웃</button>
        </li>
    );
}
