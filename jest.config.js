module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "^.+\\.(ts|tsx)$": "babel-jest", // ← 여기가 핵심
    },
    moduleNameMapper: {
        "\\.(css|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // 이미지 무시
        "^next/image$": "<rootDir>/__mocks__/next/image.tsx",
        "^@/(.*)$": "<rootDir>/$1",
    },
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
