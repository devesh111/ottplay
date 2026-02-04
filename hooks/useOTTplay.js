import { useState, useEffect, useCallback } from 'react';
import { ottplayService } from '@/lib/api/ottplay';

/**
 * Custom hook for fetching widget list from OTTplay API
 * Used for premium page content
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useWidgetList = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getWidgetList(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch widget list');
      console.error('useWidgetList error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching new releases
 * Used for premium page new releases section
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useNewReleases = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getNewReleases(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch new releases');
      console.error('useNewReleases error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching OTT partners/providers
 * Used for premium page OTT partners section
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useOTTPartners = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getOTTPartners(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch OTT partners');
      console.error('useOTTPartners error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching provider widget list
 * Used for provider page
 * @param {string} providerId - Provider ID
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useProviderWidgetList = (providerId, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getProviderWidgetList(providerId, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch provider widget list');
      console.error('useProviderWidgetList error:', err);
    } finally {
      setLoading(false);
    }
  }, [providerId, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching provider ranking
 * Used for provider page ranked content
 * @param {string} providerId - Provider ID
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useProviderRanking = (providerId, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!providerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getProviderRanking(providerId, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch provider ranking');
      console.error('useProviderRanking error:', err);
    } finally {
      setLoading(false);
    }
  }, [providerId, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching movie details
 * Used for movie details page
 * @param {string} seoUrl - Movie SEO URL
 * @returns {Object} { data, loading, error, refetch }
 */
export const useMovieDetails = (seoUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!seoUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getMovieDetails(seoUrl);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch movie details');
      console.error('useMovieDetails error:', err);
    } finally {
      setLoading(false);
    }
  }, [seoUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching show details
 * Used for TV show details page
 * @param {string} seoUrl - Show SEO URL
 * @param {Object} params - Query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useShowDetails = (seoUrl, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!seoUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getShowDetails(seoUrl, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch show details');
      console.error('useShowDetails error:', err);
    } finally {
      setLoading(false);
    }
  }, [seoUrl, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching episode details
 * Used for TV show episodes page
 * @param {string} seoUrl - Show SEO URL
 * @param {Object} params - Query parameters (seasonNumber, limit, page, etc.)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useEpisodeDetails = (seoUrl, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!seoUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getEpisodeDetails(seoUrl, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch episode details');
      console.error('useEpisodeDetails error:', err);
    } finally {
      setLoading(false);
    }
  }, [seoUrl, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching live TV details
 * Used for live TV details page
 * @param {string} seoUrl - Live TV SEO URL
 * @returns {Object} { data, loading, error, refetch }
 */
export const useLiveTVDetails = (seoUrl) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!seoUrl) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getLiveTVDetails(seoUrl);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch live TV details');
      console.error('useLiveTVDetails error:', err);
    } finally {
      setLoading(false);
    }
  }, [seoUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching sports details
 * Used for sports details page
 * @param {string} ottplayId - Sports content OTTplay ID
 * @returns {Object} { data, loading, error, refetch }
 */
export const useSportsDetails = (ottplayId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!ottplayId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getSportsDetails(ottplayId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch sports details');
      console.error('useSportsDetails error:', err);
    } finally {
      setLoading(false);
    }
  }, [ottplayId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for fetching video player information
 * Used for video player integration
 * @param {Object} params - Query parameters (ottplay_id, provider, content_type, hash, etc.)
 * @returns {Object} { data, loading, error, refetch }
 */
export const useVideoPlayer = (params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!params.ottplay_id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.getVideoPlayer(params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch video player');
      console.error('useVideoPlayer error:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

/**
 * Custom hook for search autocomplete
 * Used for search suggestions
 * @param {string} query - Search query
 * @param {Object} params - Additional query parameters
 * @returns {Object} { data, loading, error, refetch }
 */
export const useSearchAutocomplete = (query, params = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!query || query.length < 2) {
      setData(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await ottplayService.searchAutocomplete(query, params);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to fetch search suggestions');
      console.error('useSearchAutocomplete error:', err);
    } finally {
      setLoading(false);
    }
  }, [query, params]);

  useEffect(() => {
    // Debounce search requests
    const timer = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(timer);
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};
