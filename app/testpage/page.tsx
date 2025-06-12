"use client";

import React from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, MeshDistortMaterial } from "@react-three/drei";
// import styles from "@/styles/test.module.scss"

export default function TestPage() {
    return (
        <div style={{ width: "100vw", height: "100vh", background: "#111" }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <Environment preset="city" /> {/* 환경맵으로 반사효과 자연스럽게 */}
                <Glass />
                <OrbitControls enableZoom={true} />
            </Canvas>
        </div>
    );
}

function Glass() {
    return (
        <mesh>
            <sphereGeometry args={[1.5, 128, 128]} />
            <MeshDistortMaterial
                color="#ffffff"
                attach="material"
                distort={0.3} // 유리 굴곡
                speed={1.5}
                roughness={0.1}
                metalness={0.2}
                transmission={1} // 유리 효과
                thickness={5}
                ior={1.5}
                envMapIntensity={1.2}
            />
        </mesh>
    );
}
