/**
 * Client-side API helper.
 * All functions here call our own Next.js Route Handlers (/api/...).
 * No API keys or secrets are used here — they live only in Route Handlers on the server.
 */

async function clientFetch(path) {
    const response = await fetch(path);
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Request failed: ${response.status}`);
    }
    return response.json();
}

function buildUrl(path, params) {
    const qs = new URLSearchParams(params).toString();
    return qs ? `${path}?${qs}` : path;
}

export async function fetchWidgetList() {
    return clientFetch("/api/widget-list");
}

export async function fetchCarouselItems(params) {
    return clientFetch(buildUrl("/api/carousel", params));
}

export async function fetchMovieDetails(params) {
    return clientFetch(buildUrl("/api/movie-details", params));
}

export async function fetchShowDetails(params) {
    return clientFetch(buildUrl("/api/show-details", params));
}

export async function fetchEpisodes(params) {
    return clientFetch(buildUrl("/api/episodes", params));
}

export async function fetchSportDetails(params) {
    return clientFetch(buildUrl("/api/sport-details", params));
}

export async function fetchSearchContent(params) {
    return clientFetch(buildUrl("/api/search", params));
}

export async function fetchProviderWidgets(params) {
    return clientFetch(buildUrl("/api/provider-widgets", params));
}

export async function fetchProviderCarouselItems(params) {
    return clientFetch(buildUrl("/api/provider-carousel", params));
}

export async function fetMoviesList(params) {
    return clientFetch(buildUrl("/api/movies", params));
}

export async function fetchShowsList(params) {
    return clientFetch(buildUrl("/api/shows", params));
}
