module.exports = {
    testEnvironment: "jest-environment-jsdom",
    setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
    transform: {
        "^.+\\.(t|j)sx?$": ["babel-jest", { configFile: "./babel.config.jest.js" }],
    },
    moduleNameMapper: {
        "\\.(css|scss|sass)$": "identity-obj-proxy",
        "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // 이미지 무시
        "^next/image$": "<rootDir>/__mocks__/next/image.tsx",
        "^@/(.*)$": "<rootDir>/$1",
    },
    testPathIgnorePatterns: ["/node_modules/", "/.next/"],
};
