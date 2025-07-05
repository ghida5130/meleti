// warmup.mjs
import http from "http";

const options = {
    hostname: "localhost",
    port: 3000,
    path: "/book/9788936434595",
    method: "GET",
};

const req = http.request(options, (res) => {
    console.log(`🔥 Warm-up request complete. Status: ${res.statusCode}`);
});

req.on("error", (error) => {
    console.error("Warm-up failed:", error);
});

req.end();
