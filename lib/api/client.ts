/**
 * API Client for OTT Platform
 * Handles all API requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ott-platform.lindy.site/api'

interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  timestamp: string
}

interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
  }
  timestamp: string
}

/**
 * Make API request with error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit & { language?: string } = {}
): Promise<T> {
  const { language = 'en', ...fetchOptions } = options

  const headers = new Headers(fetchOptions.headers || {})
  headers.set('Content-Type', 'application/json')
  headers.set('Accept-Language', language)

  // Add auth token if available
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || 'API request failed')
  }

  return response.json()
}

// ============================================================================
// AUTH ENDPOINTS
// ============================================================================

export const authApi = {
  /**
   * Request OTP for login
   */
  requestOTP: async (phoneOrEmail: string) => {
    return apiRequest('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ phoneOrEmail }),
    })
  },

  /**
   * Verify OTP and get authentication token
   */
  verifyOTP: async (phoneOrEmail: string, otp: string) => {
    const response = await apiRequest<ApiResponse<{ token: string; user: any }>>(
      '/auth/verify-otp',
      {
        method: 'POST',
        body: JSON.stringify({ phoneOrEmail, otp }),
      }
    )
    // Store token
    if (typeof window !== 'undefined' && response.data.token) {
      localStorage.setItem('authToken', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response
  },

  /**
   * Register new user
   */
  register: async (data: {
    email?: string
    phone?: string
    firstName?: string
    lastName?: string
    password?: string
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  /**
   * Logout
   */
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    }
  },
}

// ============================================================================
// CONTENT ENDPOINTS
// ============================================================================

export const contentApi = {
  /**
   * Get movies list
   */
  getMovies: async (page = 1, limit = 20, genreId?: string, language = 'en') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(genreId && { genreId }),
    })
    return apiRequest<PaginatedResponse<any>>(
      `/content/movies?${params}`,
      { language }
    )
  },

  /**
   * Get movie details
   */
  getMovieDetail: async (id: string, language = 'en') => {
    return apiRequest(`/content/movies/${id}`, { language })
  },

  /**
   * Get shows list
   */
  getShows: async (page = 1, limit = 20, genreId?: string, language = 'en') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(genreId && { genreId }),
    })
    return apiRequest<PaginatedResponse<any>>(
      `/content/shows?${params}`,
      { language }
    )
  },

  /**
   * Get show details with seasons
   */
  getShowDetail: async (id: string, language = 'en') => {
    return apiRequest(`/content/shows/${id}`, { language })
  },

  /**
   * Get live TV channels
   */
  getLiveTV: async (language = 'en') => {
    return apiRequest('/content/live-tv', { language })
  },
}

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

export const searchApi = {
  /**
   * Search content
   */
  search: async (query: string, contentType = 'all', language = 'en') => {
    const params = new URLSearchParams({
      query,
      contentType,
    })
    return apiRequest(`/search?${params}`, { language })
  },
}

// ============================================================================
// WATCHLIST ENDPOINTS
// ============================================================================

export const watchlistApi = {
  /**
   * Get user's watchlist
   */
  getWatchlist: async (page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    })
    return apiRequest(`/watchlist?${params}`, {
      method: 'GET',
    })
  },

  /**
   * Add to watchlist
   */
  addToWatchlist: async (contentId: string, contentType: 'movie' | 'show') => {
    return apiRequest('/watchlist', {
      method: 'POST',
      body: JSON.stringify({ contentId, contentType }),
    })
  },

  /**
   * Update watchlist item
   */
  updateWatchlistItem: async (
    id: string,
    status: string,
    watchedProgress?: number
  ) => {
    return apiRequest(`/watchlist/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status, ...(watchedProgress && { watchedProgress }) }),
    })
  },

  /**
   * Remove from watchlist
   */
  removeFromWatchlist: async (id: string) => {
    return apiRequest(`/watchlist/${id}`, {
      method: 'DELETE',
    })
  },
}

// ============================================================================
// SUBSCRIPTIONS ENDPOINTS
// ============================================================================

export const subscriptionsApi = {
  /**
   * Get subscription plans
   */
  getPlans: async (platformId?: string) => {
    const params = new URLSearchParams(platformId ? { platformId } : {})
    return apiRequest(`/subscriptions/plans?${params}`)
  },

  /**
   * Get user subscriptions
   */
  getSubscriptions: async () => {
    return apiRequest('/subscriptions')
  },

  /**
   * Create subscription
   */
  createSubscription: async (planId: string) => {
    return apiRequest('/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ planId }),
    })
  },
}

// ============================================================================
// ARTICLES ENDPOINTS
// ============================================================================

export const articlesApi = {
  /**
   * Get articles
   */
  getArticles: async (page = 1, limit = 10, language = 'en') => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    })
    return apiRequest(`/articles?${params}`, { language })
  },

  /**
   * Get article details
   */
  getArticleDetail: async (slug: string, language = 'en') => {
    return apiRequest(`/articles/${slug}`, { language })
  },
}
