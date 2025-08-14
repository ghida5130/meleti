/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV !== "production",
    buildExcludes: [/middleware-manifest\.json$/],
};

const nextConfig = {
    swcMinify: true,
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
            {
                protocol: "https",
                hostname: "firebasestorage.googleapis.com",
            },
        ],
    },
};

export default withPWA(pwaConfig)(nextConfig);
