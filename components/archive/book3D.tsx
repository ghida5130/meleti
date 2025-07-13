// ❌ Deprecated: 2024-07-12
// 사용하지 않음. three.js 도서 표시 부분 suspense 처리를 위한 임시 컴포넌트

// "use client";
// import { useEffect, useState } from "react";

// export default function Book3D({ cover }: { cover: string }) {
//     const [BookImage, setBookImage] = useState<React.ComponentType<{ cover: string }> | null>(null);

//     useEffect(() => {
//         const load = () => {
//             import("../book/bookImage").then((mod) => {
//                 setBookImage(() => mod.default);
//             });
//         };

//         if ("requestIdleCallback" in window) {
//             (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(load);
//         } else {
//             setTimeout(load, 0);
//         }
//     }, []);

//     if (!BookImage) return <div style={{ height: "500px", width: "100%" }}>Loading 3D Book...</div>;
//     return <BookImage cover={cover} />;
// }
