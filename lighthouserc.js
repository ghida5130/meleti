module.exports = {
    ci: {
        collect: {
            url: ["http://localhost:3000/book/9788936434595"], // 한강 - 채식주의자 페이지의 lighthouse ci
            startServerCommand: "npm start",
            waitForReady: true,
            readyPattern: "Ready",
            numberOfRuns: 1,
            settings: {
                formFactor: "mobile",
                // 모바일 환경 기준 측정
                screenEmulation: {
                    mobile: true,
                    width: 393,
                    height: 852,
                    deviceScaleFactor: 3,
                    disabled: false,
                },
                throttlingMethod: "devtools",
                throttling: {
                    rttMs: 75, // LTE 기준 지연시간
                    throughputKbps: 10000, // 약 1MB/s
                    cpuSlowdownMultiplier: 2,
                },
            },
        },
        upload: {
            target: "temporary-public-storage",
        },
    },
};
