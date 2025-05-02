"use client";

import { db } from "@/firebase/firebasedb";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function Testpage() {
    const [value, setValue] = useState("");

    const UpLoad = async () => {
        await addDoc(collection(db, "users"), {
            name: "test",
            key: "123",
        });
    };

    return (
        <>
            <form onSubmit={(event) => event.preventDefault()}>
                <input onChange={(event) => setValue(event.target.value)} />
                <div>{value}</div>
                <button onClick={UpLoad}>전송</button>
            </form>
        </>
    );
}
