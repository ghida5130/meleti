module.exports = {
    ci: {
        collect: {
            url: ["http://localhost:3000/book/9788936434595"], // 한강 - 채식주의자 페이지의 lighthouse ci
            startServerCommand: "npm start",
            startServerReadyPattern: "Ready",
            numberOfRuns: 3,
            settings: {
                // - 모바일 환경에서 약 5Mbps, 지연 100ms, CPU 4배 감속으로 시뮬레이션 측정
                formFactor: "mobile",
                throttlingMethod: "simulate",
                throttling: {
                    rttMs: 100,
                    throughputKbps: 5 * 1024,
                    cpuSlowdownMultiplier: 4,
                },
            },
        },
        upload: {
            target: "temporary-public-storage",
        },
    },
};
