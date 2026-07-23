import axios from 'axios';
const AUTH_TOKEN_KEY = 'token';
const AUTH_USER_KEY = 'user';
const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
export const getToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
export const getUser = () => {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw)
        return null;
    try {
        return JSON.parse(raw);
    }
    catch {
        return null;
    }
};
export const setAuth = (token, user) => {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
};
export const clearAuth = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
};
export const isAuthenticated = () => Boolean(getToken());
export const attachAuthHeader = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
export const createApiClient = () => {
    const instance = axios.create({
        baseURL: API_BASE_URL,
    });
    instance.interceptors.request.use((config) => {
        const token = getToken();
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
    instance.interceptors.response.use((response) => response, (error) => {
        if (error.response && [401, 403].includes(error.response.status)) {
            clearAuth();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    });
    return instance;
};
