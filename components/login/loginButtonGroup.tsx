"use client";

// components
import LoginButton from "./loginButton";

export default function LoginButtonGroup() {
    return (
        <>
            <LoginButton provider="google" />
            <LoginButton provider="github" />
            <LoginButton provider="demo" />
        </>
    );
}
