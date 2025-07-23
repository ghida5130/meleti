"use client";

import Image from "next/image";
import { Canvas, useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Mesh, MathUtils, Texture, TextureLoader } from "three";
import styles from "/styles/bookImage.module.scss";
import { useBook } from "@/providers/BookContext";

// public
import rotateIcon from "@/public/bookPage/rotate.svg";
import leftSideIcon from "@/public/bookPage/leftSide.png";
import rightSideIcon from "@/public/bookPage/rightSide.png";
import bookPageTextureImage from "@/public/bookImage/bookPageTexture.jpg";
import backEmptyImage from "@/public/bookImage/backEmptyImage.jpg";
import sideEmptyImage from "@/public/bookImage/sideEmptyImage.jpg";
import plusButtonIcon from "@/public/bookImage/plus.svg";
import compareButtonIcon from "@/public/bookImage/compare.webp";

// hooks & utils
import { useUserData } from "@/hooks/redux/useUserData";
import { useToast } from "@/hooks/redux/useToast";
import useBookSize from "@/hooks/utils/useBookSize";
import { normalizeBookSize } from "@/utils/book/normalizeBookSize";
import { generateBookCoverUrl } from "@/utils/book/generateBookCoverUrl";

// components
import BookImageSkeleton from "./bookImageSkeleton";

type RotatingBookPropsType = {
    rotationY: number;
    cover: string;
    convertedWidth: number;
    convertedHeight: number;
    convertedDepth: number;
};

const RotatingBook = ({ rotationY, cover, convertedWidth, convertedHeight, convertedDepth }: RotatingBookPropsType) => {
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

    // 책 표지, 옆면, 뒷면 이미지 가져오기 (URL)
    const { coverImage: front, sideImage: side, backImage: back } = generateBookCoverUrl(cover);

    const [loadedTextures, setLoadedTextures] = useState<{
        cover: Texture;
        backCover: Texture;
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
            const [cover, backCover, left, white] = await Promise.all([
                loadTexture(front, backEmptyImage.src), // 앞면
                loadTexture(back, backEmptyImage.src), // 뒷면
                loadTexture(side, sideEmptyImage.src), // 좌측
                loader.loadAsync(bookPageTextureImage.src), // 흰색 텍스처 (기본)
            ]);
            return { cover, backCover, left, white };
        };

        const texturesPromise = loadAllTextures();

        return texturesPromise;
    }, [front, back, side]);

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
                <boxGeometry args={[convertedDepth, convertedHeight, convertedWidth]} /> {/* 책 크기 */}
                <meshBasicMaterial attach="material-0" map={loadedTextures.cover} /> {/* 앞면 */}
                <meshBasicMaterial attach="material-1" map={loadedTextures.backCover} /> {/* 뒷면 */}
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

export default function Book3DViewer({ cover, isbn }: { cover: string; isbn: string }) {
    const [rotationY, setRotationY] = useState(3);
    const { setIsPopupOpen } = useBook();
    const router = useRouter();
    const { isLogin } = useUserData();
    const { setToast } = useToast();

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

    // 책의 실제 사이즈
    const { size, isLoading, error } = useBookSize(isbn);
    const [width, height, depth] = size;

    if (isLoading) return <BookImageSkeleton />;

    // 표시영역에 맞춰 책 사이즈 계산
    const [convertedWidth, convertedHeight, convertedDepth] = normalizeBookSize({ width, height, depth });

    if (error) {
        setToast({ message: "책 사이즈 정보가 없어 기본 사이즈로 표시합니다.", type: "error" });
    }
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
                    <RotatingBook
                        rotationY={rotationY}
                        cover={cover}
                        convertedWidth={convertedWidth}
                        convertedHeight={convertedHeight}
                        convertedDepth={convertedDepth}
                    />
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
                <button
                    className={`${styles.btn} ${styles.plusBtn}`}
                    onClick={() => {
                        if (isLogin) setIsPopupOpen(true);
                        else setToast({ message: "로그인이 필요합니다", type: "error" });
                    }}
                >
                    <Image src={plusButtonIcon} alt="add my library button" width={30} priority />
                </button>
                <button
                    className={`${styles.btn} ${styles.compareBtn}`}
                    onClick={() => {
                        router.push(`/book/compare/select?base=${isbn}`);
                    }}
                >
                    <Image src={compareButtonIcon} alt="add my library button" width={30} priority />
                </button>
            </div>
        </>
    );
}
