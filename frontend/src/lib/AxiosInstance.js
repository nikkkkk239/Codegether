import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api`,
});

// Attach bearer token from localStorage to every request if present
axiosInstance.interceptors.request.use(
    (config) => {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers = config.headers || {};
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (e) {
            // ignore
        }
        return config;
    },
    (error) => Promise.reject(error)
);