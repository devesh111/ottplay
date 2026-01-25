import axios from "axios";

/**
 * API Base URL - uses environment variable with fallback to production URL
 * @type {string}
 */
const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "https://ott-platform.lindy.site/api";

/**
 * ApiClient class for handling all API requests
 * Provides methods for GET, POST, PUT, PATCH, DELETE requests
 * Includes request/response interceptors for authentication and language headers
 */
class ApiClient {
    /**
     * Initialize the API client with axios instance and interceptors
     */
    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Add request interceptor to include auth token and language
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

    /**
     * Make a GET request
     * @param {string} url - The endpoint URL
     * @param {Object} config - Optional axios config
     * @returns {Promise} Response promise
     */
    async get(url, config) {
        return this.client.get(url, config);
    }

    /**
     * Make a POST request
     * @param {string} url - The endpoint URL
     * @param {Object} data - Request body data
     * @param {Object} config - Optional axios config
     * @returns {Promise} Response promise
     */
    async post(url, data, config) {
        return this.client.post(url, data, config);
    }

    /**
     * Make a PUT request
     * @param {string} url - The endpoint URL
     * @param {Object} data - Request body data
     * @param {Object} config - Optional axios config
     * @returns {Promise} Response promise
     */
    async put(url, data, config) {
        return this.client.put(url, data, config);
    }

    /**
     * Make a PATCH request
     * @param {string} url - The endpoint URL
     * @param {Object} data - Request body data
     * @param {Object} config - Optional axios config
     * @returns {Promise} Response promise
     */
    async patch(url, data, config) {
        return this.client.patch(url, data, config);
    }

    /**
     * Make a DELETE request
     * @param {string} url - The endpoint URL
     * @param {Object} config - Optional axios config
     * @returns {Promise} Response promise
     */
    async delete(url, config) {
        return this.client.delete(url, config);
    }
}

export const apiClient = new ApiClient();
