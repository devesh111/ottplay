import axios from 'axios';

/**
 * OTTplay API Service
 * Centralized service for all OTTplay API endpoints
 * Base URL: https://api2.ottplay.com
 * Authentication: Bearer token in Authorization header
 */

const OTTPLAY_BASE_URL = 'https://api2.ottplay.com';
const BEARER_TOKEN = 'F421D63D166CA343454DD833B599C';

/**
 * Common headers required for all OTTplay API requests
 * @returns {Object} Headers object with authorization and metadata
 */
const getCommonHeaders = () => ({
  'Authorization': `Bearer ${BEARER_TOKEN}`,
  'apiVersion': '1',
  'source': 'web',
  'platform': 'web',
  'Content-Type': 'application/json',
});

/**
 * Create axios instance for OTTplay API
 * Includes request/response interceptors for error handling
 */
const ottplayClient = axios.create({
  baseURL: OTTPLAY_BASE_URL,
  headers: getCommonHeaders(),
});

// Response interceptor for error handling
ottplayClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('OTTplay API Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      endpoint: error.config?.url,
    });
    return Promise.reject(error);
  }
);

/**
 * OTTplay API Service Class
 * Provides methods for all OTTplay API endpoints
 */
class OTTplayService {
  /**
   * Premium Page - Widget List API
   * Fetches widget list for premium/subscription page
   * @param {Object} params - Query parameters
   * @returns {Promise} Widget list data
   */
  async getWidgetList(params = {}) {
    try {
      const defaultParams = {
        platform: 'web',
        menu: 'Subscription',
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.5/web/widget/list', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching widget list:', error);
      throw error;
    }
  }

  /**
   * Premium Page - New Release API
   * Fetches new releases for premium page
   * @param {Object} params - Query parameters
   * @returns {Promise} New releases data
   */
  async getNewReleases(params = {}) {
    try {
      const defaultParams = {
        module_name: 'Subscription',
        platform: 'web',
        section: 'widget_new_release_27',
        limit: 15,
        pin_it: true,
        title: 'NewReleases',
        template_name: 'new_releases',
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.7/web/ranking', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching new releases:', error);
      throw error;
    }
  }

  /**
   * Premium Page - OTT Partners API
   * Fetches list of OTT partners/providers
   * @param {Object} params - Query parameters
   * @returns {Promise} OTT partners data
   */
  async getOTTPartners(params = {}) {
    try {
      const defaultParams = {
        module_name: 'Subscription',
        platform: 'web',
        section: 'widget__oTTplay_partners',
        limit: 100,
        pin_it: false,
        title: 'OTTplay partners',
        template_name: 'providers',
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.7/web/ranking', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching OTT partners:', error);
      throw error;
    }
  }

  /**
   * Provider Page - Provider Widget List API
   * Fetches widget list for a specific provider
   * @param {string} providerId - Provider ID (e.g., 'jiohotstar/4025a7f67d456')
   * @param {Object} params - Additional query parameters
   * @returns {Promise} Provider widget list data
   */
  async getProviderWidgetList(providerId, params = {}) {
    try {
      const defaultParams = {
        platform: 'web',
        menu: providerId,
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.5/web/widget/providerwidget/', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching provider widget list:', error);
      throw error;
    }
  }

  /**
   * Provider Page - Provider Ranking API
   * Fetches ranked content for a specific provider
   * @param {string} providerId - Provider ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Provider ranking data
   */
  async getProviderRanking(providerId, params = {}) {
    try {
      const defaultParams = {
        module_name: providerId,
        platform: 'web',
        section: 'widget_most_watched_2025_jHS',
        limit: 25,
        title: 'Most Watched In 2025',
        pin_it: true,
        template_name: 'most_watched_in_2025',
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.6/web/ranking/providerwidgetranking', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching provider ranking:', error);
      throw error;
    }
  }

  /**
   * Asset Details Page - Movie Details API
   * Fetches detailed information about a movie
   * @param {string} seoUrl - SEO URL of the movie (e.g., 'border-1997/eb2e1a54e1160')
   * @returns {Promise} Movie details data
   */
  async getMovieDetails(seoUrl) {
    try {
      const response = await ottplayClient.get('/api/v4.6/mobile/movie/seo/url', {
        params: { seoUrl },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  }

  /**
   * Asset Details Page - Show Details API
   * Fetches detailed information about a TV show
   * @param {string} seoUrl - SEO URL of the show (e.g., 'bigg-boss-2026/19e65009f674')
   * @param {Object} params - Additional query parameters
   * @returns {Promise} Show details data
   */
  async getShowDetails(seoUrl, params = {}) {
    try {
      const defaultParams = {
        seoUrl,
        pc_type: 0,
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.6/web/show/seo/url', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching show details:', error);
      throw error;
    }
  }

  /**
   * Asset Details Page - Episode Details API
   * Fetches episodes for a TV show
   * @param {string} seoUrl - SEO URL of the show
   * @param {Object} params - Query parameters (seasonNumber, limit, page, etc.)
   * @returns {Promise} Episode details data
   */
  async getEpisodeDetails(seoUrl, params = {}) {
    try {
      const defaultParams = {
        seoUrl,
        limit: 5,
        page: 1,
        custom: true,
        sortBy: 'desc',
        error_version: 2,
        ...params,
      };
      
      const response = await ottplayClient.get('/api/v4.6/web/episode/seo/url', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching episode details:', error);
      throw error;
    }
  }

  /**
   * Asset Details Page - Live TV Details API
   * Fetches detailed information about a live TV channel
   * @param {string} seoUrl - SEO URL of the live TV channel
   * @returns {Promise} Live TV details data
   */
  async getLiveTVDetails(seoUrl) {
    try {
      const response = await ottplayClient.get('/api/v4.5/web/liveTV/details', {
        params: { seoUrl },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching live TV details:', error);
      throw error;
    }
  }

  /**
   * Asset Details Page - Sports Details API
   * Fetches detailed information about sports content
   * @param {string} ottplayId - OTTplay ID of the sports content
   * @returns {Promise} Sports details data
   */
  async getSportsDetails(ottplayId) {
    try {
      const response = await ottplayClient.get('/api/v4.5/web/tournaments/sports-details', {
        params: { ottplay_id: ottplayId },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching sports details:', error);
      throw error;
    }
  }

  /**
   * Partner Service API - Video Player API
   * Fetches video player information for streaming content
   * @param {Object} params - Query parameters (ottplay_id, provider, content_type, hash, etc.)
   * @returns {Promise} Video player data
   */
  async getVideoPlayer(params = {}) {
    try {
      const response = await ottplayClient.get('/api/partner-service/v4.2/videoplayer', {
        params: params,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching video player:', error);
      throw error;
    }
  }

  /**
   * Search - Universal Autocomplete API
   * Fetches search suggestions based on query
   * @param {string} query - Search query string
   * @param {Object} params - Additional query parameters (limit, is_parental, state, etc.)
   * @returns {Promise} Search suggestions data
   */
  async searchAutocomplete(query, params = {}) {
    try {
      const defaultParams = {
        query,
        limit: 12,
        is_parental: 'off',
        state: 1,
        ...params,
      };
      
      const response = await ottplayClient.get('/api/search-service/v1.1/universal-autocomplete', {
        params: defaultParams,
      });
      
      return response.data;
    } catch (error) {
      console.error('Error fetching search suggestions:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const ottplayService = new OTTplayService();

// Export class for testing/extension
export default OTTplayService;
