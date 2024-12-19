/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const pwaConfig = {
    dest: "public",
    register: true,
    skipWaiting: true,
};

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "image.aladin.co.kr",
            },
        ],
    },
};

export default withPWA(pwaConfig)(nextConfig);
