module.exports = {
    ci: {
        collect: {
            url: ["http://localhost:3000/book/9788936434595"], // 한강 - 채식주의자 페이지의 lighthouse ci
            startServerCommand: "npm start",
            waitForReady: true,
            readyPattern: "Ready",
            numberOfRuns: 2,
        },
        upload: {
            target: "temporary-public-storage",
        },
    },
};
