/**
 * OTTplay API Client
 *
 * This module provides functions to interact with the OTTplay API.
 * It handles authentication, request formatting, and response parsing.
 *
 * Base URL: https://api2.ottplay.com/api/v4.5
 * Authentication: Bearer token in Authorization header
 */

// API Configuration
const API_BASE_URL = "https://api2.ottplay.com/api/v4.5";
const API_BASE_URL_RANK = "https://api2.ottplay.com/api/v4.7";
const BEARER_TOKEN = "F421D63D166CA343454DD833B599C";

/**
 * Common headers for all API requests
 * Includes authentication, API version, source, and platform information
 */
const getHeaders = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${BEARER_TOKEN}`,
    source: "web",
    platform: "web",
});

/**
 * Fetch widget list from OTTplay API
 * Returns all available widgets/sections for the home page
 *
 * Endpoint: /web/widget/list
 * Parameters: platform=web, menu=Subscription
 *
 * @returns {Promise<Object>} Widget list response from API
 * @throws {Error} If API request fails
 */
export async function fetchWidgetList() {
    try {
        const url = `${API_BASE_URL}/web/widget/list?platform=web&menu=Subscription`;

        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(),
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching widget list:", error);
        throw error;
    }
}

/**
 * Fetch carousel items from OTTplay API
 * Retrieves content items for a specific carousel/section
 *
 * Endpoint: /web/widget/list (with specific parameters)
 * Parameters: module_name, platform, section, limit, title
 *
 * @param {Object} params - Query parameters
 * @param {string} params.module_name - Module name (e.g., 'Home')
 * @param {string} params.platform - Platform (e.g., 'web')
 * @param {string} params.section - Section identifier (e.g., 'widget_mix_search')
 * @param {number} params.limit - Maximum number of items to fetch (e.g., 50)
 * @param {string} params.title - Section title (e.g., 'Featured+Carousel')
 *
 * @returns {Promise<Object>} Carousel items response from API
 * @throws {Error} If API request fails
 */
export async function fetchCarouselItems(params) {
    try {
        // Build query string from parameters
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL_RANK}/web/ranking?${queryString}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(),
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching carousel items:", error);
        throw error;
    }
}

/**
 * Fetch content details from OTTplay API
 * Retrieves detailed information about a specific content item
 *
 * @param {string} contentId - The unique identifier of the content
 *
 * @returns {Promise<Object>} Content details response from API
 * @throws {Error} If API request fails
 */
export async function fetchContentDetails(contentId) {
    try {
        const url = `${API_BASE_URL}/web/content/${contentId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(),
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching content details:", error);
        throw error;
    }
}

/**
 * Search content on OTTplay API
 * Searches for content based on query string
 *
 * @param {string} query - Search query string
 * @param {Object} options - Additional search options
 * @param {number} options.limit - Maximum number of results (default: 20)
 * @param {number} options.offset - Pagination offset (default: 0)
 *
 * @returns {Promise<Object>} Search results response from API
 * @throws {Error} If API request fails
 */
export async function searchContent(query, options = {}) {
    try {
        const { limit = 20, offset = 0 } = options;

        // Build query string with search parameters
        const params = new URLSearchParams({
            q: query,
            limit: limit.toString(),
            offset: offset.toString(),
        });

        const url = `${API_BASE_URL}/web/search?${params.toString()}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(),
        });

        // Check if response is successful
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching content:", error);
        throw error;
    }
}
