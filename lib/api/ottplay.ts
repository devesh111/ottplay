/**
 * OTTplay API Client
 * Handles all API requests to the OTTplay backend
 * Uses Bearer token authentication
 */

const API_BASE_URL = 'https://api2.ottplay.com/api/v4.5';
const BEARER_TOKEN = 'F421D63D166CA343454DD833B599C';

/**
 * Common headers required for all OTTplay API requests
 */
const getHeaders = () => ({
  'authorization': `Bearer ${BEARER_TOKEN}`,
  'apiVersion': '3',
  'source': 'web',
  'platform': 'web',
  'Content-Type': 'application/json',
});

/**
 * Fetch widget list from OTTplay API
 * Returns all available sections/widgets for the home page
 * @returns Promise with widget list data
 */
export async function fetchWidgetList() {
  try {
    const url = `${API_BASE_URL}/web/widget/list?platform=web&menu=Subscription`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Widget list API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching widget list:', error);
    throw error;
  }
}

/**
 * Fetch carousel items for a specific widget section
 * @param params - Query parameters for the carousel endpoint
 * @returns Promise with carousel items data
 */
export async function fetchCarouselItems(params: {
  module_name: string;
  platform: string;
  section: string;
  limit: number;
  title: string;
}) {
  try {
    // Build query string from params
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    const url = `${API_BASE_URL}/web/widget/list?${queryString}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Carousel API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching carousel items:', error);
    throw error;
  }
}

/**
 * Fetch movie/show details from OTTplay API
 * @param contentId - The ID of the content to fetch
 * @param type - Type of content: 'movie', 'show', 'episode', 'live_tv', or 'sports'
 * @returns Promise with content details
 */
export async function fetchContentDetails(contentId: string, type: string) {
  try {
    const url = `${API_BASE_URL}/web/content/${type}/${contentId}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Content details API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching content details:', error);
    throw error;
  }
}

/**
 * Search content using autocomplete
 * @param query - Search query string
 * @returns Promise with search results
 */
export async function searchContent(query: string) {
  try {
    const url = `${API_BASE_URL}/web/search/autocomplete?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Search API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching content:', error);
    throw error;
  }
}
