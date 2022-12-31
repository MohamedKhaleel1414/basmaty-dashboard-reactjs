import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "https://api.basmauae.com",
    headers:{
        "Api-Version":"v1",
        "Api-Locale":"ar",
        "Content-Type": "multipart/form-data"
    }
});

// axiosInstance.interceptors.request.use(
//     function (config) {
//         return config;
//     },
//     function (error) {
//         return Promise.reject(error);
//     }
// )

// axiosInstance.interceptors.response.use(
//     function (response) {
//         return response;

//     },
//     function (error) {
//         return Promise.reject(error);
//     }
// )
