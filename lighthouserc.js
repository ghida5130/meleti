module.exports = {
    ci: {
        collect: {
            url: ["http://localhost:3000/book/9788936434595"], // 한강 - 채식주의자 페이지의 lighthouse ci
            startServerCommand: "npm start",
            startServerReadyPattern: "Ready",
            numberOfRuns: 3,
            settings: {
                // - Lighthouse 기본 모바일 환경 및 시뮬레이션 방식으로 측정
                formFactor: "mobile",
                throttlingMethod: "simulate",
            },
        },
        upload: {
            target: "temporary-public-storage",
        },
    },
};
