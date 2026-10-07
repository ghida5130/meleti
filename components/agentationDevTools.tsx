"use client";

import dynamic from "next/dynamic";
import styles from "./agentationDevTools.module.scss";

const Agentation = dynamic(() => import("agentation").then((module) => module.Agentation), {
    ssr: false,
});

export default function AgentationDevTools() {
    if (process.env.NODE_ENV !== "development") return null;

    return <Agentation className={styles.toolbar} appName="Meleti" endpoint={process.env.NEXT_PUBLIC_AGENTATION_ENDPOINT} />;
}
