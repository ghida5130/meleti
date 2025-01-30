"use client";

import firestore from "@/firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useState } from "react";

export default function Testpage() {
    const [value, setValue] = useState("");

    const UpLoad = async () => {
        await addDoc(collection(firestore, "users"), {
            value,
        });
    };

    return (
        <>
            <form onSubmit={(event) => event.preventDefault()}>
                <input onChange={(event) => setValue(event.target.value)} />
                <button onClick={UpLoad}>전송</button>
            </form>
        </>
    );
}
