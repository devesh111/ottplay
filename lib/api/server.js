/**
 * Server-side API helpers.
 * These functions run ONLY on the server (in Route Handlers or Server Components).
 * Secret env vars (without NEXT_PUBLIC_ prefix) are safe here and never sent to the browser.
 */

const API_BASE_URL = process.env.API_BASE_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;
const API_AUTH = process.env.API_AUTH;

/** Standard headers used for most endpoints */
const getHeaders = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${BEARER_TOKEN}`,
    source: "web",
    platform: "web",
});

/** Extended headers used for movie/show list endpoints */
const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    authorization: `Bearer ${BEARER_TOKEN}`,
    auth: API_AUTH,
    client_id: CLIENT_ID,
});

async function serverFetch(url, headers = getHeaders()) {
    const response = await fetch(url, {
        method: "GET",
        headers,
        // Cache for 60 seconds by default; individual callers can override
        next: { revalidate: 60 },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

export async function serverFetchWidgetList() {
    const url = `${API_BASE_URL}/v4.5/web/widget/list?platform=web&menu=Subscription`;
    return serverFetch(url);
}

export async function serverFetchCarouselItems(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.7/web/ranking?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchMovieDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/mobile/movie/seo/url?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchShowDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/show/seo/url?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchEpisodes(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/episode/seo/url?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchSportDetails(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/tournaments/sports-details?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchSearchContent(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/search-service/v1.1/universal-autocomplete?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchProviderWidgets(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.5/web/widget/providerwidget?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchProviderCarouselItems(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/ranking/providerwidgetranking/?${queryString}`;
    return serverFetch(url);
}

export async function serverFetchMoviesList(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/movie/?${queryString}`;
    return serverFetch(url, getAuthHeaders());
}

export async function serverFetchShowsList(params) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/v4.6/web/show/?${queryString}`;
    return serverFetch(url, getAuthHeaders());
}
