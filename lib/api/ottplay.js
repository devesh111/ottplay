// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const BEARER_TOKEN = process.env.NEXT_PUBLIC_BEARER_TOKEN;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const API_AUTH = process.env.NEXT_PUBLIC_API_AUTH;

const getHeaders = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${BEARER_TOKEN}`,
    source: "web",
    platform: "web",
});

async function fetchDataFromApi(url) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: getHeaders(),
        });
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching api data:", error);
        throw error;
    }
}

async function fetchDataFromApi2(url, headers) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: headers,
        });
        if (!response.ok) {
            throw new Error(
                `API Error: ${response.status} ${response.statusText}`,
            );
        }

        // Parse and return JSON response
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching api data:", error);
        throw error;
    }
}

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
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.7/web/ranking?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchMovieDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/mobile/movie/seo/url?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchShowDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/show/seo/url?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchEpisodes(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/episode/seo/url?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchSportDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/tournaments/sports-details?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchSearchContent(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/search-service/v1.1/universal-autocomplete?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchProviderWidgets(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.5/web/widget/providerwidget?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetchProviderCarouselItems(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/ranking/providerwidgetranking/?${queryString}`;
    const data = fetchDataFromApi(url);
    return data;
}

export async function fetMoviesList(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/movie/?${queryString}`;
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${BEARER_TOKEN}`,
        auth: API_AUTH,
        client_id: CLIENT_ID,
    };
    const data = fetchDataFromApi2(url, headers);
    return data;
}

export async function fetchShowsList(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/show/?${queryString}`;
    const headers = {
        "Content-Type": "application/json",
        authorization: `Bearer ${BEARER_TOKEN}`,
        auth: API_AUTH,
        client_id: CLIENT_ID,
    };
    const data = fetchDataFromApi2(url, headers);
    return data;
}
