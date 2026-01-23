# OTT Platform Frontend

A modern, production-ready Next.js frontend for the OTT Platform aggregator and content discovery application.

## 🎯 Features

- **Modern UI**: Built with Next.js 15, React, and shadcn/ui components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: OTP-based login and user registration
- **Content Discovery**: Browse movies, shows, and live TV
- **Search**: Full-text search across all content
- **Watchlist**: Save and manage your favorite content
- **User Profile**: Manage preferences and settings
- **Multilingual**: Support for English and Arabic

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/devesh111/ottplay.git
cd ott-frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
```bash
cp .env.example .env.local
```

4. **Start development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
ott-frontend/
├── app/
│   ├── auth/                    # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── content/                 # Content pages
│   │   ├── movies/
│   │   └── shows/
│   ├── search/                  # Search page
│   ├── watchlist/               # Watchlist page
│   ├── profile/                 # User profile
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── layout/                  # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Providers.tsx
│   ├── content/                 # Content components
│   │   ├── MovieCard.tsx
│   │   └── ShowCard.tsx
│   ├── auth/                    # Auth components
│   └── ui/                      # shadcn/ui components
├── lib/
│   ├── api/
│   │   └── client.ts            # API client
│   ├── hooks/                   # Custom hooks
│   └── store/                   # State management
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── package.json
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

## 🔌 API Integration

The frontend connects to the OTT Platform backend API:

**Base URL**: `https://ott-platform.lindy.site/api`

### Available Endpoints

**Authentication**:
- `POST /auth/request-otp` - Request OTP
- `POST /auth/verify-otp` - Verify OTP
- `POST /auth/register` - Register user

**Content**:
- `GET /content/movies` - Get movies
- `GET /content/movies/{id}` - Get movie details
- `GET /content/shows` - Get shows
- `GET /content/shows/{id}` - Get show details
- `GET /content/live-tv` - Get live TV

**Search**:
- `GET /search` - Search content

**Watchlist**:
- `GET /watchlist` - Get watchlist
- `POST /watchlist` - Add to watchlist
- `PATCH /watchlist/{id}` - Update watchlist
- `DELETE /watchlist/{id}` - Remove from watchlist

## 🎨 UI Components

The frontend uses shadcn/ui components:

- **Button** - Interactive buttons
- **Input** - Text input fields
- **Card** - Content containers
- **Badge** - Status indicators
- **Dialog** - Modal dialogs
- **Tabs** - Tabbed content
- **And more...**

## 🌍 Multilingual Support

The frontend supports multiple languages:

- **English** (en) - Default
- **Arabic** (ar) - Full support

Language preference is detected from:
1. User's browser language
2. User's saved preference
3. Query parameter (`?lang=ar`)

## 🔐 Authentication

### Login Flow

1. User enters phone or email
2. System sends OTP
3. User enters OTP
4. System generates JWT token
5. Token stored in localStorage
6. User redirected to home page

### Registration Flow

1. User fills registration form
2. Account created in backend
3. User redirected to login
4. User can now login with OTP

## 📱 Responsive Design

The frontend is fully responsive:

- **Mobile**: 320px and up
- **Tablet**: 768px and up
- **Desktop**: 1024px and up

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style

- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **Components**: React functional components
- **State Management**: React hooks + localStorage

## 📦 Dependencies

### Core
- **next**: 15.5.6
- **react**: 19.0.0
- **react-dom**: 19.0.0

### UI
- **@radix-ui/***: Component primitives
- **lucide-react**: Icons
- **tailwindcss**: Styling

### Utilities
- **clsx**: Class name utilities

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**:
```bash
git push origin main
```

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Import the repository
   - Set environment variables
   - Deploy

### Deploy to Other Platforms

The frontend can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Google Cloud Run
- Docker containers

## 🔒 Security

- **JWT Tokens**: Stored in localStorage
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configured on backend
- **Input Validation**: All inputs validated
- **XSS Protection**: React escapes content by default

## 📊 Performance

- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Lazy Loading**: Components loaded on demand
- **Caching**: Browser and server caching

## 🐛 Troubleshooting

### API Connection Issues

If you see "Failed to fetch" errors:

1. Check `NEXT_PUBLIC_API_URL` in `.env.local`
2. Ensure backend is running
3. Check CORS configuration
4. Verify network connectivity

### Authentication Issues

If login fails:

1. Check OTP expiration (10 minutes)
2. Verify phone/email format
3. Check localStorage for token
4. Clear browser cache

### Build Issues

If build fails:

1. Clear `.next` directory: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check Node.js version: `node --version`

## 📞 Support

For issues or questions:

1. Check the backend README
2. Review API documentation
3. Check browser console for errors
4. Review network requests in DevTools

## 📝 License

MIT License - See LICENSE file for details

## 🎉 Getting Started

1. Clone the repository
2. Install dependencies
3. Configure environment variables
4. Start development server
5. Open http://localhost:3000

Happy coding! 🚀
