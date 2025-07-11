"use client";

import useImageSize from "@/hooks/useImageSize";
import { Canvas, useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
// import * as THREE from "three";
import { Mesh, MathUtils, Texture, TextureLoader } from "three";
import styles from "/styles/bookImage.module.scss";
import { useBook } from "@/providers/BookContext";

// image
import rotateIcon from "@/public/bookPage/rotate.svg";
import leftSideIcon from "@/public/bookPage/leftSide.png";
import rightSideIcon from "@/public/bookPage/rightSide.png";
import Image from "next/image";
import bookPageTextureImage from "/public/bookImage/bookPageTexture.jpg";
import backEmptyImage from "/public/bookImage/backEmptyImage.jpg";
import sideEmptyImage from "/public/bookImage/sideEmptyImage.jpg";
import plusButtonIcon from "@/public/bookImage/plus.svg";

const RotatingBook: React.FC<{ rotationY: number; cover: string }> = ({ rotationY, cover }) => {
    const bookRef = useRef<Mesh>(null);
    const { invalidate } = useThree();

    const rotateAngle = [0, Math.PI * 0.5, Math.PI * 1, Math.PI * 0.2, Math.PI * 0.8, Math.PI * 1.3];

    useEffect(() => {
        invalidate();
    }, [rotationY]);

    useFrame(() => {
        if (bookRef.current) {
            const currentY = bookRef.current.rotation.y;
            const targetY = rotateAngle[rotationY];

            if (Math.abs(currentY - targetY) > 0.001) {
                bookRef.current.rotation.y = MathUtils.lerp(currentY, targetY, 0.1);
                invalidate();
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

    // 이미지 가져오기
    const coverImage = useMemo(() => cover.replace("coversum", "cover500"), [cover]); //큰 사이즈로 가져오기위해 url수정
    const sideImage = useMemo(() => `${bookImageURL}spineflip/${bookNum[1]}_d.jpg`, [bookImageURL, bookNum]);
    const backImage = useMemo(() => `${bookImageURL}letslook/${bookNum[1]}_b.jpg`, [bookImageURL, bookNum]);

    // useImageSize를 이용해 책 사이즈 계산
    const [coverWidth, coverHeight] = useImageSize(coverImage);
    const [coverSideDepth] = useImageSize(sideImage);

    // 화면 영역 내부에 객체를 두기위한 고정 Height값과 기본 Width, Depth값 지정
    const fixedHeight = 4.5;
    let convertedWidth = 3;
    let convertedDepth = 0.3;
    let bookSizeRatio = 1;

    // Height와 Width의 비율을 통해 fixedHeight를 기준으로 convertedWidth 계산
    if (coverHeight !== null && coverWidth !== null) {
        bookSizeRatio = coverHeight / fixedHeight;
        convertedWidth = coverWidth / bookSizeRatio;
    }

    // convertedDepth 계산
    if (coverSideDepth !== null) {
        convertedDepth = coverSideDepth / bookSizeRatio;
    }

    const [loadedTextures, setLoadedTextures] = useState<{
        front: Texture;
        back: Texture;
        left: Texture;
        white: Texture;
    } | null>(null);

    const textures = useMemo(() => {
        const loader = new TextureLoader();

        const loadTexture = (url: string, fallback: string): Promise<Texture> => {
            return new Promise((resolve) => {
                loader.load(
                    url,
                    (texture) => resolve(texture),
                    undefined,
                    () => resolve(loader.load(fallback))
                );
            });
        };

        const loadAllTextures = async () => {
            const [front, back, left, white] = await Promise.all([
                loadTexture(coverImage, backEmptyImage.src), // 앞면
                loadTexture(backImage, backEmptyImage.src), // 뒷면
                loadTexture(sideImage, sideEmptyImage.src), // 좌측
                loader.loadAsync(bookPageTextureImage.src), // 흰색 텍스처 (기본)
            ]);
            return { front, back, left, white };
        };

        const texturesPromise = loadAllTextures();

        return texturesPromise;
    }, [coverImage, backImage, sideImage]);

    useEffect(() => {
        textures.then((loadedTextures) => {
            setLoadedTextures(loadedTextures);
        });
    }, [textures]);

    if (!loadedTextures) {
        return null;
    }

    return (
        <>
            <mesh ref={bookRef} position={[0, 0, 0]} castShadow>
                <boxGeometry args={[convertedDepth, fixedHeight, convertedWidth]} /> {/* 책 크기 */}
                <meshBasicMaterial attach="material-0" map={loadedTextures.front} /> {/* 앞면 */}
                <meshBasicMaterial attach="material-1" map={loadedTextures.back} /> {/* 뒷면 */}
                <meshBasicMaterial attach="material-2" map={loadedTextures.white} /> {/* 윗면 */}
                <meshBasicMaterial attach="material-3" map={loadedTextures.white} /> {/* 아랫면 */}
                <meshBasicMaterial attach="material-4" map={loadedTextures.left} /> {/* 좌측 */}
                <meshBasicMaterial attach="material-5" map={loadedTextures.white} /> {/* 우측 */}
            </mesh>
        </>
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
    const { setIsPopupOpen } = useBook();

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
                <Canvas camera={{ position: [24, 0, 0], fov: 13 }} shadows frameloop="demand">
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
                    <Image src={rotateIcon} alt="rotate button" width={30} priority />
                </button>
                <button
                    onClick={() => {
                        setRotationY(3);
                    }}
                    className={`${styles.btn} ${styles.leftSideBtn}`}
                >
                    <Image src={leftSideIcon} alt="left side button" width={35} priority />
                </button>
                <button
                    onClick={() => {
                        setRotationY(4);
                    }}
                    className={`${styles.btn} ${styles.rightSideBtn}`}
                >
                    <Image src={rightSideIcon} alt="right side button" width={35} priority />
                </button>
                <button className={`${styles.btn} ${styles.plusBtn}`} onClick={() => setIsPopupOpen(true)}>
                    <Image src={plusButtonIcon} alt="add my library button" width={30} priority />
                </button>
            </div>
        </>
    );
};

export default BookImage;
