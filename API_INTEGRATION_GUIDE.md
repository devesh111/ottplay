# OTTplay API Integration Guide

This document provides comprehensive information about the OTTplay API integration in the ottplay application.

## Overview

The application integrates with the OTTplay API to fetch and display content from various OTT (Over-The-Top) streaming platforms. All API endpoints are centralized in a service layer with custom React hooks for easy data fetching.

## API Service Architecture

### Service Layer: `lib/api/ottplay.js`

The OTTplay API service provides a centralized client for all API endpoints with:
- Automatic authentication (Bearer token)
- Common headers management
- Error handling and logging
- Request/response interceptors

**Key Features:**
- Base URL: `https://api2.ottplay.com`
- Authentication: Bearer token in Authorization header
- Common headers: `apiVersion`, `source: web`, `platform: web`

### Custom Hooks: `hooks/useOTTplay.js`

Custom React hooks provide easy data fetching with:
- Loading states
- Error handling
- Automatic refetching
- Debouncing for search queries

**Available Hooks:**
- `useWidgetList()` - Fetch widget list for premium page
- `useNewReleases()` - Fetch new releases
- `useOTTPartners()` - Fetch OTT partners/providers
- `useProviderWidgetList(providerId)` - Fetch provider-specific widgets
- `useProviderRanking(providerId)` - Fetch provider-specific ranked content
- `useMovieDetails(seoUrl)` - Fetch movie details
- `useShowDetails(seoUrl)` - Fetch TV show details
- `useEpisodeDetails(seoUrl)` - Fetch episode list
- `useLiveTVDetails(seoUrl)` - Fetch live TV details
- `useSportsDetails(ottplayId)` - Fetch sports details
- `useVideoPlayer(params)` - Fetch video player information
- `useSearchAutocomplete(query)` - Fetch search suggestions

## API Endpoints

### 1. Widget List API
**Purpose:** Fetch widget list for premium/subscription page

**Endpoint:** `GET /api/v4.5/web/widget/list`

**Parameters:**
- `platform` (string): "web"
- `menu` (string): "Subscription"

**Usage:**
```javascript
const { data, loading, error } = useWidgetList();
```

**Response Structure:**
```json
{
  "widgets": [
    {
      "id": "widget_id",
      "title": "Widget Title",
      "items": [
        {
          "id": "item_id",
          "title": "Content Title",
          "poster_url": "https://...",
          "rating": 8.5
        }
      ]
    }
  ]
}
```

### 2. New Releases API
**Purpose:** Fetch newly released content

**Endpoint:** `GET /api/v4.7/web/ranking`

**Parameters:**
- `module_name` (string): "Subscription"
- `platform` (string): "web"
- `section` (string): "widget_new_release_27"
- `limit` (number): 15
- `pin_it` (boolean): true
- `title` (string): "NewReleases"
- `template_name` (string): "new_releases"

**Usage:**
```javascript
const { data, loading, error } = useNewReleases();
```

### 3. OTT Partners API
**Purpose:** Fetch list of OTT streaming partners/providers

**Endpoint:** `GET /api/v4.7/web/ranking`

**Parameters:**
- `module_name` (string): "Subscription"
- `platform` (string): "web"
- `section` (string): "widget__oTTplay_partners"
- `limit` (number): 100
- `pin_it` (boolean): false
- `title` (string): "OTTplay partners"
- `template_name` (string): "providers"

**Usage:**
```javascript
const { data, loading, error } = useOTTPartners();
```

### 4. Provider Widget List API
**Purpose:** Fetch widgets for a specific OTT provider

**Endpoint:** `GET /api/v4.5/web/widget/providerwidget/`

**Parameters:**
- `platform` (string): "web"
- `menu` (string): Provider ID (e.g., "jiohotstar/4025a7f67d456")

**Usage:**
```javascript
const { data, loading, error } = useProviderWidgetList("jiohotstar/4025a7f67d456");
```

### 5. Provider Ranking API
**Purpose:** Fetch ranked content for a specific provider

**Endpoint:** `GET /api/v4.6/web/ranking/providerwidgetranking`

**Parameters:**
- `module_name` (string): Provider ID
- `platform` (string): "web"
- `section` (string): Widget section ID
- `limit` (number): 25
- `title` (string): Section title
- `pin_it` (boolean): true
- `template_name` (string): Template name
- `provider_id` (string): Provider ID

**Usage:**
```javascript
const { data, loading, error } = useProviderRanking("jiohotstar/4025a7f67d456");
```

### 6. Movie Details API
**Purpose:** Fetch detailed information about a movie

**Endpoint:** `GET /api/v4.6/mobile/movie/seo/url`

**Parameters:**
- `seoUrl` (string): Movie SEO URL (e.g., "border-1997/eb2e1a54e1160")

**Usage:**
```javascript
const { data, loading, error } = useMovieDetails("border-1997/eb2e1a54e1160");
```

**Response Structure:**
```json
{
  "data": {
    "id": "movie_id",
    "title": "Movie Title",
    "description": "Movie description",
    "poster_url": "https://...",
    "backdrop_url": "https://...",
    "rating": 8.5,
    "release_date": "2023-01-01",
    "duration": "120 min",
    "genres": ["Action", "Drama"],
    "cast": [
      {
        "name": "Actor Name",
        "character": "Character Name",
        "image": "https://..."
      }
    ]
  }
}
```

### 7. Show Details API
**Purpose:** Fetch detailed information about a TV show

**Endpoint:** `GET /api/v4.6/web/show/seo/url`

**Parameters:**
- `seoUrl` (string): Show SEO URL (e.g., "bigg-boss-2026/19e65009f674")
- `pc_type` (number): 0

**Usage:**
```javascript
const { data, loading, error } = useShowDetails("bigg-boss-2026/19e65009f674");
```

### 8. Episode Details API
**Purpose:** Fetch episodes for a TV show

**Endpoint:** `GET /api/v4.6/web/episode/seo/url`

**Parameters:**
- `seoUrl` (string): Show SEO URL
- `limit` (number): 5
- `page` (number): 1
- `seasonNumber` (number): Season number
- `custom` (boolean): true
- `sortBy` (string): "desc"
- `error_version` (number): 2

**Usage:**
```javascript
const { data, loading, error } = useEpisodeDetails("bigg-boss-2026/19e65009f674", {
  seasonNumber: 6,
  limit: 10
});
```

### 9. Live TV Details API
**Purpose:** Fetch information about a live TV channel

**Endpoint:** `GET /api/v4.5/web/liveTV/details`

**Parameters:**
- `seoUrl` (string): Live TV SEO URL (e.g., "navbharat-2025/ddff5a3a20332")

**Usage:**
```javascript
const { data, loading, error } = useLiveTVDetails("navbharat-2025/ddff5a3a20332");
```

### 10. Sports Details API
**Purpose:** Fetch information about sports content

**Endpoint:** `GET /api/v4.5/web/tournaments/sports-details`

**Parameters:**
- `ottplay_id` (string): OTTplay ID of sports content

**Usage:**
```javascript
const { data, loading, error } = useSportsDetails("d193226dd7111");
```

### 11. Video Player API
**Purpose:** Fetch video player information for streaming

**Endpoint:** `GET /api/partner-service/v4.2/videoplayer`

**Parameters:**
- `ottplay_id` (string): Content OTTplay ID
- `provider` (string): Provider ID
- `content_type` (string): "movie", "show", "episode", etc.
- `hash` (string): Content hash
- Additional headers: `auth`, `client_id`, `device_code`

**Usage:**
```javascript
const { data, loading, error } = useVideoPlayer({
  ottplay_id: "1939d1a9e884",
  provider: "5f456c2aff9ccd034434e6fd",
  content_type: "movie",
  hash: "31393339643161396538383435663435"
});
```

### 12. Search Autocomplete API
**Purpose:** Fetch search suggestions based on query

**Endpoint:** `GET /api/search-service/v1.1/universal-autocomplete`

**Parameters:**
- `query` (string): Search query
- `limit` (number): 12
- `is_parental` (string): "off"
- `state` (number): 1

**Usage:**
```javascript
const { data, loading, error } = useSearchAutocomplete("rrr", { limit: 12 });
```

**Response Structure:**
```json
{
  "suggestions": [
    {
      "id": "content_id",
      "title": "Content Title",
      "type": "movie",
      "image_url": "https://...",
      "rating": 8.5
    }
  ]
}
```

## Authentication

**Bearer Token:** `F421D63D166CA343454DD833B599C`

All requests include the Authorization header:
```
Authorization: Bearer F421D63D166CA343454DD833B599C
```

**Important:** This token is hardcoded in the service layer. For production, consider:
1. Moving to environment variables
2. Implementing token refresh mechanism
3. Adding rate limiting
4. Implementing request caching

## Common Headers

All requests include these headers:
```
Authorization: Bearer F421D63D166CA343454DD833B599C
apiVersion: 1
source: web
platform: web
Content-Type: application/json
```

## Error Handling

The service layer includes automatic error handling:

```javascript
// Errors are logged to console
console.error('OTTplay API Error:', {
  status: error.response?.status,
  message: error.response?.data?.message || error.message,
  endpoint: error.config?.url,
});

// Errors are passed to hooks
const { data, loading, error } = useNewReleases();
if (error) {
  console.error('Failed to fetch:', error);
}
```

## Usage Examples

### Example 1: Display New Releases on Home Page

```javascript
import { useNewReleases } from '@/hooks/useOTTplay';

export function NewReleasesSection() {
  const { data, loading, error } = useNewReleases();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.items?.map(item => (
        <div key={item.id}>
          <h3>{item.title}</h3>
          <img src={item.poster_url} alt={item.title} />
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Search with Autocomplete

```javascript
import { useSearchAutocomplete } from '@/hooks/useOTTplay';

export function SearchComponent() {
  const [query, setQuery] = useState('');
  const { data: suggestions, loading } = useSearchAutocomplete(query);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      {loading && <div>Loading suggestions...</div>}
      {suggestions?.suggestions?.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

### Example 3: Fetch Movie Details

```javascript
import { useMovieDetails } from '@/hooks/useOTTplay';

export function MovieDetailsPage({ seoUrl }) {
  const { data, loading, error } = useMovieDetails(seoUrl);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const movie = data?.data;
  return (
    <div>
      <h1>{movie?.title}</h1>
      <img src={movie?.poster_url} alt={movie?.title} />
      <p>{movie?.description}</p>
      <p>Rating: {movie?.rating}/10</p>
    </div>
  );
}
```

## Data Transformation

The application includes helper functions to transform API responses into consistent formats:

```javascript
// Transform API response to content card format
const transformContentData = (items) => {
  return items.map((item) => ({
    id: item.id || item.ottplay_id || item._id,
    title: item.title || item.name || "Untitled",
    posterUrl: item.poster_url || item.posterUrl || item.image_url || "",
    rating: item.rating || item.imdb_rating || 0,
    type: item.type || item.content_type || "movie",
  }));
};
```

## Performance Optimization

### Debouncing
Search queries are debounced to reduce API calls:
```javascript
// 300ms debounce on search
useEffect(() => {
  const timer = setTimeout(() => {
    fetchData();
  }, 300);
  return () => clearTimeout(timer);
}, [query]);
```

### Conditional Fetching
Hooks only fetch when required parameters are provided:
```javascript
// Only fetches if seoUrl is provided
const { data } = useMovieDetails(seoUrl);
```

### Response Caching
Consider implementing caching for frequently accessed data:
```javascript
// Cache responses in localStorage or React Query
const cachedData = localStorage.getItem(`movie_${seoUrl}`);
if (cachedData) return JSON.parse(cachedData);
```

## Troubleshooting

### Common Issues

**1. 401 Unauthorized**
- Bearer token may be expired or invalid
- Check token in `lib/api/ottplay.js`
- Verify Authorization header is being sent

**2. CORS Errors**
- API may not support CORS from browser
- Consider using Next.js API routes as proxy
- Add CORS headers if available

**3. Empty Responses**
- API may return different response structure
- Check response in browser DevTools Network tab
- Update data extraction logic in hooks

**4. Rate Limiting**
- API may have rate limits
- Implement request caching
- Add exponential backoff for retries

### Debug Mode

Enable detailed logging:
```javascript
// In lib/api/ottplay.js
ottplayClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

## Future Enhancements

1. **Token Management**
   - Implement token refresh mechanism
   - Store token securely in httpOnly cookies
   - Add token expiration handling

2. **Caching Strategy**
   - Implement React Query for server state management
   - Cache responses with TTL
   - Implement stale-while-revalidate pattern

3. **Rate Limiting**
   - Add request queuing
   - Implement exponential backoff
   - Monitor API usage

4. **Error Recovery**
   - Implement retry logic with exponential backoff
   - Add fallback data
   - Implement error boundaries

5. **Analytics**
   - Track API performance
   - Monitor error rates
   - Analyze user search patterns

## API Documentation References

- **OTTplay API Base:** https://api2.ottplay.com
- **API Version:** v4.5, v4.6, v4.7
- **Search Service:** v1.1
- **Partner Service:** v4.2

## Support

For API-related issues:
1. Check the API response in browser DevTools
2. Verify all required parameters are provided
3. Check Authorization header is correct
4. Review error messages in console
5. Test endpoint directly with curl or Postman

## Files Structure

```
lib/
  api/
    ottplay.js          # OTTplay API service
    client.js           # Generic API client (for other APIs)
hooks/
  useOTTplay.js         # Custom React hooks for OTTplay API
app/
  page.jsx              # Home page with API integration
  providers/
    page.jsx            # Providers page
  asset/
    [id]/
      page.jsx          # Asset details page
  search/
    page.jsx            # Search page with autocomplete
```

## Next Steps

1. Test all API endpoints with sample data
2. Implement caching strategy
3. Add error boundaries and fallback UI
4. Implement analytics tracking
5. Add user preferences (language, filters)
6. Implement watchlist functionality
7. Add video player integration
8. Implement user authentication

