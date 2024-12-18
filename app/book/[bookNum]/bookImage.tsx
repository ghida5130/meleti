"use client";

import useImageSize from "@/app/hooks/useImageSize";
// components/RotatingBook.tsx
import { Canvas } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import * as THREE from "three";
import styles from "/styles/bookImage.module.scss";

// image
import rotateIcon from "../../../public/bookPage/rotate.svg";
import leftSideIcon from "../../../public/bookPage/leftSide.png";
import rightSideIcon from "../../../public/bookPage/rightSide.png";
import Image from "next/image";

const RotatingBook: React.FC<{ rotationY: number; cover: string }> = ({ rotationY, cover }) => {
    const bookRef = useRef<THREE.Mesh>(null);

    const rotateAngle = [0, Math.PI * 0.5, Math.PI * 1, Math.PI * 0.2, Math.PI * 0.8];

    useFrame(() => {
        if (bookRef.current) {
            const currentY = bookRef.current.rotation.y;
            const targetY = rotateAngle[rotationY];

            if (Math.abs(currentY - targetY) > 0.001) {
                bookRef.current.rotation.y = THREE.MathUtils.lerp(currentY, targetY, 0.1);
            } else {
                bookRef.current.rotation.y = targetY;
            }
        }
    });

    const bookNum = cover.match(/coversum\/(.*?)_/);
    if (!bookNum) {
        throw new Error("'coversum', '_' not found.");
    }
    const bookImageURL = cover.split(/coversum/)[0];

    const coverImage = cover.replace("coversum", "cover500");
    const sideImage = `${bookImageURL}spineflip/${bookNum[1]}_d.jpg`;
    const backImage = `${bookImageURL}letslook/${bookNum[1]}_b.jpg`;

    const [coverW, coverH] = useImageSize(coverImage);
    const [sideW] = useImageSize(sideImage);
    const bookSizeRatio = 3.3;
    let convertH = 4.5;
    let convertD = 0.3;

    if (coverW !== null && coverH !== null && sideW !== null) {
        convertH = coverH * (bookSizeRatio / coverW);
        convertD = sideW * (bookSizeRatio / coverW);
    }

    const textures = {
        front: new THREE.TextureLoader().load(coverImage),
        back: new THREE.TextureLoader().load(backImage),
        left: new THREE.TextureLoader().load(sideImage),
        white: new THREE.TextureLoader().load(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAArMBwCZh+fAAAAAASUVORK5CYII="
        ), // 흰색 텍스처
    };

    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(20, 10, 5);
    light.castShadow = true;

    return (
        <mesh ref={bookRef} position={[0, 0, 0]} castShadow>
            <boxGeometry args={[convertD, convertH, bookSizeRatio]} /> {/* 책 크기 */}
            <meshBasicMaterial attach="material-0" map={textures.front} /> {/* 앞면 */}
            <meshBasicMaterial attach="material-1" map={textures.back} /> {/* 뒷면 */}
            <meshBasicMaterial attach="material-2" map={textures.white} /> {/* 윗면 */}
            <meshBasicMaterial attach="material-3" map={textures.white} /> {/* 아랫면 */}
            <meshBasicMaterial attach="material-4" map={textures.left} /> {/* 좌측 */}
            <meshBasicMaterial attach="material-5" map={textures.white} /> {/* 우측 */}
        </mesh>
    );
};

const Plane = () => (
    <mesh
        receiveShadow
        rotation={[0, 1.6, 0]}
        position={[-2, 0, 0]} // 평면 위치
    >
        <planeGeometry args={[10, 10]} /> {/* 평면 크기 */}
        <shadowMaterial opacity={0.2} /> {/* 그림자 투명도 */}
    </mesh>
);

const BookImage: React.FC<{ cover: string }> = ({ cover }) => {
    const [rotationY, setRotationY] = useState(3);

    const handleRotate = () => {
        switch (rotationY) {
            case 0:
                setRotationY(1);
                break;
            case 1:
                setRotationY(2);
                break;
            case 2:
                setRotationY(0);
                break;
            case 3:
                setRotationY(1);
                break;
            case 4:
                setRotationY(2);
                break;
            default:
                setRotationY(0);
                break;
        }
    };
    return (
        <>
            <div className={styles.wrap}>
                <Canvas camera={{ position: [24, 0, 0], fov: 13 }} shadows>
                    <ambientLight intensity={0.5} />
                    <spotLight
                        position={[20, 3, 3]}
                        angle={0.2}
                        castShadow
                        shadow-mapSize-width={512}
                        shadow-mapSize-height={512}
                        shadow-radius={50}
                    />
                    <RotatingBook rotationY={rotationY} cover={cover} />
                    <Plane />
                </Canvas>
                <button onClick={handleRotate} className={`${styles.btn} ${styles.rotateBtn}`}>
                    <Image src={rotateIcon} alt="rotateBtn" width={30} />
                </button>
                <button
                    onClick={() => {
                        setRotationY(3);
                    }}
                    className={`${styles.btn} ${styles.leftSideBtn}`}
                >
                    <Image src={leftSideIcon} alt="rotateBtn" width={35} />
                </button>
                <button
                    onClick={() => {
                        setRotationY(4);
                    }}
                    className={`${styles.btn} ${styles.rightSideBtn}`}
                >
                    <Image src={rightSideIcon} alt="rotateBtn" width={35} />
                </button>
            </div>
        </>
    );
};

export default BookImage;
