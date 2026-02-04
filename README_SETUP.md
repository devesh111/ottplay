# OTTplay Application - Setup & Deployment Guide

## Project Overview

This is a Next.js-based OTT (Over-The-Top) streaming platform aggregator that integrates with the OTTplay API to display movies, TV shows, and other streaming content from multiple providers.

**Key Features:**
- Real-time content fetching from OTTplay APIs
- Multi-language support (English & Arabic)
- Search with autocomplete suggestions
- Provider browsing and filtering
- Asset details pages (movies, shows, live TV, sports)
- Responsive design with shadcn/ui components
- Dark theme optimized for streaming content

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** JavaScript/React
- **Styling:** Tailwind CSS + shadcn/ui
- **HTTP Client:** Axios
- **API Integration:** OTTplay API v4.5, v4.6, v4.7

## Project Structure

```
ottplay/
├── app/
│   ├── layout.jsx              # Root layout
│   ├── page.jsx                # Home page (original)
│   ├── page-ottplay.jsx        # Home page with OTTplay API integration
│   ├── api/                    # API routes
│   ├── providers/
│   │   └── page.jsx            # Providers listing page
│   ├── asset/
│   │   └── [id]/
│   │       └── page.jsx        # Asset details page
│   └── search/
│       └── page.jsx            # Search page with autocomplete
├── components/
│   ├── ui/                     # shadcn/ui components
│   ├── layout/                 # Layout components (Header, Footer, Sidebar)
│   ├── sections/               # Page sections
│   ├── content/                # Content-specific components
│   └── home/                   # Home page components
├── hooks/
│   └── useOTTplay.js           # Custom React hooks for OTTplay API
├── lib/
│   ├── api/
│   │   ├── ottplay.js          # OTTplay API service
│   │   └── client.js           # Generic API client
│   └── utils.js                # Utility functions
├── public/
│   └── images/                 # Static images and assets
├── API_INTEGRATION_GUIDE.md    # Comprehensive API documentation
├── README_SETUP.md             # This file
└── package.json                # Dependencies
```

## Installation & Setup

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn package manager
- Git (for cloning the repository)

### Step 1: Clone Repository

```bash
cd /home/code
git clone https://github.com/devesh111/ottplay.git
cd ottplay
```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Environment Variables

Create a `.env.local` file in the project root:

```bash
# .env.local

# OTTplay API Configuration
NEXT_PUBLIC_API_URL="https://api2.ottplay.com"

# App Configuration
NEXT_PUBLIC_APP_NAME="OTTplay"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=""

# Optional: Third-party services
NEXT_PUBLIC_STRIPE_KEY=""
```

**Note:** The OTTplay API bearer token is hardcoded in `lib/api/ottplay.js`. For production, move it to environment variables:

```bash
# Add to .env.local
NEXT_PUBLIC_OTTPLAY_TOKEN="F421D63D166CA343454DD833B599C"
```

Then update `lib/api/ottplay.js`:
```javascript
const BEARER_TOKEN = process.env.NEXT_PUBLIC_OTTPLAY_TOKEN;
```

### Step 4: Start Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

## Using the OTTplay API Integration

### Switching to OTTplay API Home Page

The application includes two home page versions:

1. **Original Home Page:** `app/page.jsx` (with mock data)
2. **OTTplay API Home Page:** `app/page-ottplay.jsx` (with real API data)

To use the OTTplay API integration:

**Option 1: Rename the file**
```bash
# Backup original
mv app/page.jsx app/page-original.jsx

# Use OTTplay version
mv app/page-ottplay.jsx app/page.jsx
```

**Option 2: Update imports in layout**
```javascript
// In app/layout.jsx
import Home from './page-ottplay'
```

### Available Pages

After setup, the following pages are available:

- **Home:** `http://localhost:3000/` - Featured content, new releases, OTT partners
- **Providers:** `http://localhost:3000/providers` - Browse all OTT providers
- **Search:** `http://localhost:3000/search` - Search with autocomplete
- **Asset Details:** `http://localhost:3000/asset/[id]` - Movie/show details

### API Integration Features

The application includes:

1. **OTTplay API Service** (`lib/api/ottplay.js`)
   - Centralized API client
   - Automatic authentication
   - Error handling and logging
   - 12 different API endpoints

2. **Custom React Hooks** (`hooks/useOTTplay.js`)
   - `useWidgetList()` - Featured content
   - `useNewReleases()` - New releases
   - `useOTTPartners()` - OTT providers
   - `useMovieDetails()` - Movie information
   - `useShowDetails()` - TV show information
   - `useSearchAutocomplete()` - Search suggestions
   - And 6 more specialized hooks

3. **Pages with API Integration**
   - Home page with real content
   - Providers page with provider listing
   - Search page with autocomplete
   - Asset details page for movies/shows

## Development Workflow

### Adding New Features

1. **Create API Hook** (if needed)
   ```javascript
   // In hooks/useOTTplay.js
   export const useMyFeature = (params) => {
     const [data, setData] = useState(null);
     const [loading, setLoading] = useState(true);
     const [error, setError] = useState(null);
     
     // Implementation...
   };
   ```

2. **Create Component**
   ```javascript
   // In components/sections/MySection.tsx
   import { useMyFeature } from '@/hooks/useOTTplay';
   
   export function MySection() {
     const { data, loading, error } = useMyFeature();
     // Component implementation...
   }
   ```

3. **Use in Page**
   ```javascript
   // In app/page.jsx
   import { MySection } from '@/components/sections/MySection';
   
   export default function Home() {
     return <MySection />;
   }
   ```

### Testing API Endpoints

Test API endpoints directly using curl:

```bash
# Widget List
curl -X GET "https://api2.ottplay.com/api/v4.5/web/widget/list?platform=web&menu=Subscription" \
  -H "Authorization: Bearer F421D63D166CA343454DD833B599C" \
  -H "apiVersion: 1" \
  -H "source: web" \
  -H "platform: web"

# New Releases
curl -X GET "https://api2.ottplay.com/api/v4.7/web/ranking?module_name=Subscription&platform=web&section=widget_new_release_27&limit=15" \
  -H "Authorization: Bearer F421D63D166CA343454DD833B599C" \
  -H "apiVersion: 1" \
  -H "source: web" \
  -H "platform: web"

# Search Autocomplete
curl -X GET "https://api2.ottplay.com/api/search-service/v1.1/universal-autocomplete?query=rrr&limit=12" \
  -H "Authorization: Bearer F421D63D166CA343454DD833B599C" \
  -H "apiVersion: 1" \
  -H "source: web" \
  -H "platform: web"
```

## Building for Production

### Build the Application

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `.next` directory.

### Start Production Server

```bash
npm run start
# or
yarn start
```

### Environment Variables for Production

Update `.env.local` with production values:

```bash
# Production API URL (if different)
NEXT_PUBLIC_API_URL="https://api2.ottplay.com"

# Production app URL
NEXT_PUBLIC_APP_URL="https://yourdomain.com"

# Move sensitive tokens to environment variables
NEXT_PUBLIC_OTTPLAY_TOKEN="your_token_here"
```

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Option 2: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t ottplay .
docker run -p 3000:3000 ottplay
```

### Option 3: Traditional Server (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone https://github.com/devesh111/ottplay.git
cd ottplay
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start npm --name "ottplay" -- start
pm2 save
pm2 startup
```

## Troubleshooting

### Issue: API Returns 401 Unauthorized

**Solution:**
- Check bearer token in `lib/api/ottplay.js`
- Verify token hasn't expired
- Ensure Authorization header is being sent

### Issue: CORS Errors

**Solution:**
- Create Next.js API route as proxy:
  ```javascript
  // app/api/ottplay/[...path]/route.js
  export async function GET(request, { params }) {
    const response = await fetch(
      `https://api2.ottplay.com/api/${params.path.join('/')}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OTTPLAY_TOKEN}`,
          'apiVersion': '1',
          'source': 'web',
          'platform': 'web',
        },
      }
    );
    return response;
  }
  ```

### Issue: Images Not Loading

**Solution:**
- Check image URLs in API response
- Verify image domains in `next.config.js`:
  ```javascript
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.ottplay.com',
      },
    ],
  }
  ```

### Issue: Slow Performance

**Solution:**
1. Enable caching in hooks
2. Implement React Query for server state
3. Use Next.js Image optimization
4. Enable compression in production

## Performance Optimization

### 1. Image Optimization

```javascript
import Image from 'next/image';

<Image
  src="/images/logo.png"
  alt="Logo"
  width={200}
  height={60}
  priority
/>
```

### 2. Code Splitting

```javascript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('@/components/Heavy'), {
  loading: () => <div>Loading...</div>,
});
```

### 3. API Response Caching

```javascript
// In hooks/useOTTplay.js
const cacheKey = `widget_list_${JSON.stringify(params)}`;
const cached = localStorage.getItem(cacheKey);
if (cached) return JSON.parse(cached);
```

### 4. Database Queries (if using Postgres)

```javascript
// Use indexes for frequently queried fields
CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_provider_id ON content(provider_id);
```

## Monitoring & Analytics

### Enable Console Logging

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

### Add Error Tracking (Sentry)

```bash
npm install @sentry/nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NODE_ENV,
});
```

## Security Best Practices

1. **Never commit `.env.local`** - Already in `.gitignore`
2. **Move API tokens to environment variables** - Don't hardcode in source
3. **Validate user input** - Especially for search queries
4. **Use HTTPS in production** - Always
5. **Implement rate limiting** - Prevent API abuse
6. **Add authentication** - For user-specific features

## Database Setup (Optional)

If you need to store user data (watchlist, preferences, etc.):

```bash
# Install Prisma
npm install @prisma/client
npm install -D prisma

# Initialize Prisma
npx prisma init

# Create database
createdb -h localhost -U $PGUSER ottplay

# Update .env.local
DATABASE_URL="postgresql://user:password@localhost:5432/ottplay"

# Create schema and migrate
npx prisma migrate dev --name init
```

## Contributing

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make changes and test locally
3. Commit: `git commit -am 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

## Support & Documentation

- **API Documentation:** See `API_INTEGRATION_GUIDE.md`
- **Next.js Docs:** https://nextjs.org/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind CSS:** https://tailwindcss.com
- **OTTplay API:** https://api2.ottplay.com

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Contact

For questions or issues:
- Email: devesh.pandey.1048@gmail.com
- GitHub: https://github.com/devesh111/ottplay

## Changelog

### Version 1.0.0 (Current)
- ✅ OTTplay API integration
- ✅ 12 API endpoints implemented
- ✅ Custom React hooks for data fetching
- ✅ Home page with real content
- ✅ Providers page
- ✅ Search with autocomplete
- ✅ Asset details pages
- ✅ Multi-language support (EN/AR)
- ✅ Responsive design
- ✅ Dark theme

### Planned Features
- [ ] User authentication
- [ ] Watchlist functionality
- [ ] Video player integration
- [ ] User preferences/settings
- [ ] Advanced filtering
- [ ] Recommendations engine
- [ ] Social sharing
- [ ] Mobile app (React Native)

## Quick Start Checklist

- [ ] Clone repository
- [ ] Install dependencies: `npm install`
- [ ] Create `.env.local` file
- [ ] Start dev server: `npm run dev`
- [ ] Visit `http://localhost:3000`
- [ ] Test API endpoints
- [ ] Review `API_INTEGRATION_GUIDE.md`
- [ ] Customize for your needs
- [ ] Deploy to production

---

**Last Updated:** January 31, 2026
**Maintained by:** Devesh Pandey
