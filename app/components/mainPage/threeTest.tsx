"use client"; // Next.js App Router를 사용하는 경우 필요
import React, { useEffect, useRef } from "react";
import * as THREE from "three";

function RotatingCube({ test }: { test: number }) {
    const divRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!divRef.current) return;

        // Three.js 기본 설정
        // const width = divRef.current.clientWidth;
        // const height = divRef.current.clientHeight;
        const width = test;
        const height = test;

        // 씬 생성
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("rgb(245,245,245)");

        // 카메라 생성
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.z = 5;

        // 렌더러 생성
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(width, height);
        divRef.current.appendChild(renderer.domElement);

        // 정육면체 생성
        const geometry = new THREE.BoxGeometry(2.5, 3, 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        // 애니메이션
        const animate = () => {
            requestAnimationFrame(animate);

            // 회전 추가
            // cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            renderer.dispose();
            divRef.current?.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={divRef} style={{ width: `${test}px`, height: `${test}px` }} />;
}

export default RotatingCube;
