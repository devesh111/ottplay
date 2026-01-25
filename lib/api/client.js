import axios from "axios";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL

class ApiClient {
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Add request interceptor to include auth token
        this.client.interceptors.request.use((config) => {
            const token =
                typeof window !== "undefined"
                    ? localStorage.getItem("authToken")
                    : null;
            const language =
                typeof window !== "undefined"
                    ? localStorage.getItem("language") || "en"
                    : "en";

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            config.headers["Accept-Language"] = language;

            return config;
        });

        // Add response interceptor to handle errors
        this.client.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    if (typeof window !== "undefined") {
                        localStorage.removeItem("authToken");
                        localStorage.removeItem("user");
                        window.location.href = "/";
                    }
                }
                return Promise.reject(error);
            },
        );
    }

    async get(url, config) {
        return this.client.get(url, config);
    }

    async post(url, data, config) {
        return this.client.post(url, data, config);
    }

    async put(url, data, config) {
        return this.client.put(url, data, config);
    }

    async patch(url, data, config) {
        return this.client.patch(url, data, config);
    }

    async delete(url, config) {
        return this.client.delete(url, config);
    }
}

export const apiClient = new ApiClient();
