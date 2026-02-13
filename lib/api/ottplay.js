
// API Configuration
const API_BASE_URL = "https://api2.ottplay.com/api/v4.5";
const API_BASE_URL_RANK = "https://api2.ottplay.com/api/v4.7";
const API_BASE_URL_CONTENT = "https://api2.ottplay.com/api/v4.6";
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

export async function fetchMovieDetails(params) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL_CONTENT}/mobile/movie/seo/url?${queryString}`;

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
        console.error("Error fetching movie details:", error);
        throw error;
    }
}

export async function fetchShowDetails(params) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL_CONTENT}/web/show/seo/url?${queryString}`;

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
        console.error("Error fetching show details:", error);
        throw error;
    }
}

export async function fetchEpisodes(params) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL_CONTENT}/web/episode/seo/url?${queryString}`;

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
        console.error("Error fetching episodes details:", error);
        throw error;
    }
}

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
