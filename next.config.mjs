/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV !== "production",
};

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.aladin.co.kr",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
        ],
    },
};

export default withPWA(pwaConfig)(nextConfig);
