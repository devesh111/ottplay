'use client';

import { useState, useEffect } from 'react';
import HeroSection from '@/components/home/HeroSection';
import ContentSection from '@/components/home/ContentSection';
import { ApiClient } from '@/lib/api/client';

/**
 * Home Page
 * 
 * Main landing page featuring:
 * - Hero section with featured content
 * - Multiple content sections (Trending, Upcoming, Best TV, New Releases)
 * - Responsive layout
 * 
 * @component
 * @returns {JSX.Element} The home page
 */
export default function Home() {
  const [trendingContent, setTrendingContent] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [bestTVShows, setBestTVShows] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Fetch different content categories
        const [trending, upcoming, bestTV, newRel] = await Promise.all([
          ApiClient.get('/content?category=trending&limit=10'),
          ApiClient.get('/content?category=upcoming&limit=10'),
          ApiClient.get('/content?category=best-tv&limit=10'),
          ApiClient.get('/content?category=new-releases&limit=10'),
        ]);

        setTrendingContent(trending?.data || []);
        setUpcomingMovies(upcoming?.data || []);
        setBestTVShows(bestTV?.data || []);
        setNewReleases(newRel?.data || []);
      } catch (error) {
        console.error('Error fetching content:', error);
        // Set mock data for development
        setMockData();
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const setMockData = () => {
    const mockItems = Array.from({ length: 10 }, (_, i) => ({
      id: `item-${i}`,
      title: `Movie Title ${i + 1}`,
      titleAr: `عنوان الفيلم ${i + 1}`,
      description: `This is a great movie with amazing storyline and excellent cast.`,
      posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
      rating: 8.5 + Math.random() * 1.5,
      type: i % 2 === 0 ? 'movie' : 'show',
      language: 'en',
    }));

    setTrendingContent(mockItems);
    setUpcomingMovies(mockItems);
    setBestTVShows(mockItems);
    setNewReleases(mockItems);
  };

  return (
    <main className="min-h-screen bg-[#0f0f1e]">
      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <HeroSection />
      </div>

      {/* Trending Section */}
      <ContentSection
        title="Trending Now"
        description="The most popular content right now"
        items={trendingContent}
        viewAllLink="/content/trending"
        gradient="from-[#ec4899] to-[#a855f7]"
      />

      {/* Upcoming Movies Section */}
      <ContentSection
        title="Upcoming Movies"
        description="Coming soon to your screen"
        items={upcomingMovies}
        viewAllLink="/content/movies?filter=upcoming"
        gradient="from-[#a855f7] to-[#10b981]"
      />

      {/* Best TV Shows Section */}
      <ContentSection
        title="Best in TV"
        description="Award-winning television series"
        items={bestTVShows}
        viewAllLink="/content/shows?filter=best"
        gradient="from-[#10b981] to-[#06b6d4]"
      />

      {/* New Releases Section */}
      <ContentSection
        title="New Releases"
        description="Fresh content added this week"
        items={newReleases}
        viewAllLink="/content/new"
        gradient="from-[#06b6d4] to-[#ec4899]"
      />

      {/* Call to Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
            Ready to Start Watching?
          </h2>
          <p className="text-lg text-[#9ca3af] mb-8">
            Join millions of users streaming unlimited movies and TV shows with OTTPlay
          </p>
          <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
            Subscribe Now
          </button>
        </div>
      </section>
    </main>
  );
}
