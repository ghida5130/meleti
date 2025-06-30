// // lib/api/axiosClient.ts
// import axios from "axios";
// import { refreshAccessToken } from "@/lib/auth/refresh"; // refresh 요청 함수
// import { getAccessToken, setAccessToken } from "@/lib/auth/tokenStore"; // 토큰 저장/조회 로직

// const api = axios.create({
//     baseURL: "/api",
// });

// let isRefreshing = false;
// let failedQueue: any[] = [];

// api.interceptors.request.use((config) => {
//     const token = getAccessToken();
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// });

// api.interceptors.response.use(
//     (res) => res,
//     async (err) => {
//         const originalRequest = err.config;

//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;

//             if (!isRefreshing) {
//                 isRefreshing = true;
//                 try {
//                     const newToken = await refreshAccessToken();
//                     setAccessToken(newToken);
//                     api.defaults.headers.Authorization = `Bearer ${newToken}`;
//                     failedQueue.forEach((cb) => cb(newToken));
//                     failedQueue = [];
//                 } catch (e) {
//                     // 로그아웃 처리 등
//                 } finally {
//                     isRefreshing = false;
//                 }
//             }

//             return new Promise((resolve) => {
//                 failedQueue.push((token: string) => {
//                     originalRequest.headers.Authorization = `Bearer ${token}`;
//                     resolve(api(originalRequest));
//                 });
//             });
//         }

//         return Promise.reject(err);
//     }
// );

// export default api;
