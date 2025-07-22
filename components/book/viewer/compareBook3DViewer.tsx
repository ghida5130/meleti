"use client";

import Image from "next/image";
import { Canvas, useThree } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { Mesh, MathUtils, Texture, TextureLoader } from "three";
import styles from "/styles/bookImage.module.scss";

// public
import rotateIcon from "@/public/bookPage/rotate.svg";
import leftSideIcon from "@/public/bookPage/leftSide.png";
import rightSideIcon from "@/public/bookPage/rightSide.png";
import bookPageTextureImage from "@/public/bookImage/bookPageTexture.jpg";
import backEmptyImage from "@/public/bookImage/backEmptyImage.jpg";
import sideEmptyImage from "@/public/bookImage/sideEmptyImage.jpg";

// hooks & utils
import { generateBookCoverUrl } from "@/utils/book/generateBookCoverUrl";
import { calculateCompareBookSize } from "@/utils/book/calculateCompareBookSize";
import useBookSize from "@/hooks/utils/useBookSize";
import { useToast } from "@/hooks/redux/useToast";

// components
import BookImageError from "./bookImageError";
import BookImageSkeleton from "./bookImageSkeleton";

type RotatingBookType = {
    rotationY: number;
    cover: string;
    width: number;
    height: number;
    depth: number;
};

type CompareBook3DViewerProps = { cover1: string; cover2: string; isbn1: string; isbn2: string };

const RotatingBook = ({ rotationY, cover, width, height, depth }: RotatingBookType) => {
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

    const [loadedTextures, setLoadedTextures] = useState<{
        cover: Texture;
        backCover: Texture;
        left: Texture;
        white: Texture;
    } | null>(null);

    // 책 표지, 옆면, 뒷면 이미지 가져오기 (URL)
    const { coverImage: front, sideImage: side, backImage: back } = generateBookCoverUrl(cover);

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
                <boxGeometry args={[depth, height, width]} /> {/* 책 크기 */}
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
        <planeGeometry args={[15, 20]} /> {/* 평면 크기 */}
        <shadowMaterial opacity={0.2} /> {/* 그림자 투명도 */}
    </mesh>
);

export default function CompareBook3DViewer({ cover1, cover2, isbn1, isbn2 }: CompareBook3DViewerProps) {
    const [rotationY, setRotationY] = useState(3);
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

    // 두 책의 실제 사이즈
    const { size: size1, isLoading: isLoading1, error: error1 } = useBookSize(isbn1);
    const { size: size2, isLoading: isLoading2, error: error2 } = useBookSize(isbn2);
    const [w1, h1, d1] = size1;
    const [w2, h2, d2] = size2;

    if (isLoading1 || isLoading2) return <BookImageSkeleton />;

    // 두 책의 너비, 높이중 하나라도 없다면 비교가 불가능하므로 null 반환
    if (w1 === null || w2 === null || h1 === null || h2 === null) return <BookImageError />;

    // 두 책의 사이즈를 비교하여 화면에 표시하기 적절한 사이즈로 조정
    const [cw1, ch1, cd1, cw2, ch2, cd2] = calculateCompareBookSize({ w1, h1, d1, w2, h2, d2 });

    if (error1 || error2) {
        setToast({ message: "책 사이즈 정보가 없어 기본 사이즈로 표시합니다.", type: "error" });
    }

    return (
        <>
            <div className={styles.wrap}>
                <Canvas camera={{ position: [50, 0, 0], fov: 13 }} shadows frameloop="demand">
                    <ambientLight intensity={0.5} />
                    <spotLight
                        position={[30, 3, 3]}
                        angle={0.2}
                        castShadow
                        shadow-mapSize-width={512}
                        shadow-mapSize-height={512}
                        shadow-radius={50}
                    />
                    <group position={[0, 2.6, 0]}>
                        <RotatingBook rotationY={rotationY} cover={cover1} width={cw1} height={ch1} depth={cd1} />
                    </group>
                    <group position={[0, -2.6, 0]}>
                        <RotatingBook rotationY={rotationY} cover={cover2} width={cw2} height={ch2} depth={cd2} />
                    </group>
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
            </div>
        </>
    );
}
