import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export const buildApiUrl = (path) => {
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${API_BASE_URL}${normalizedPath}`;
};

export const getAssetUrl = (path, fallback = "/assets/stonesjewel.jpg") => {
    if (!path || path === "null") return fallback;
    if (/^https?:\/\//i.test(path) || path.startsWith("/assets/")) return path;
    return buildApiUrl(path.startsWith("uploads/") ? `/${path}` : `/uploads/${path}`);
};
