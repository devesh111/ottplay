/**
 * Featured Carousel Component
 * Displays a carousel of featured content items from the OTTplay API
 * Uses the widget_mix_search section to fetch items
 */

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { fetchCarouselItems } from '@/lib/api/ottplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * FeaturedCarousel Component
 * Fetches and displays featured content in a carousel format
 */
export function FeaturedCarousel() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch carousel items on component mount
   * Uses the Featured Carousel endpoint with specific parameters
   */
  useEffect(() => {
    const loadCarouselItems = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch featured carousel items using the widget_mix_search section
        const response = await fetchCarouselItems({
          module_name: 'Home',
          platform: 'web',
          section: 'widget_mix_search',
          limit: 50,
          title: 'Featured+Carousel',
        });

        // Extract items from response - handle different response structures
        const carouselItems = response?.data?.items || response?.items || [];
        setItems(carouselItems);
      } catch (err) {
        console.error('Failed to load carousel items:', err);
        setError('Failed to load featured content');
        // Set mock data for development/fallback
        setMockItems();
      } finally {
        setLoading(false);
      }
    };

    loadCarouselItems();
  }, []);

  /**
   * Set mock carousel items for development/fallback
   * Provides placeholder data when API is unavailable
   */
  const setMockItems = () => {
    const mockData = Array.from({ length: 10 }, (_, i) => ({
      id: `featured-${i}`,
      title: `Featured Content ${i + 1}`,
      description: 'An amazing piece of content you should watch',
      posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
      thumbnailUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop`,
      rating: 8.0 + Math.random() * 2,
      type: i % 2 === 0 ? 'movie' : 'show',
      year: 2024 - Math.floor(Math.random() * 5),
    }));
    setItems(mockData);
  };

  /**
   * Render loading skeleton
   * Shows placeholder cards while data is loading
   */
  if (loading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-80 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  /**
   * Render error state
   * Shows error message if API call fails
   */
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 text-lg">{error}</p>
        <p className="text-gray-400 text-sm mt-2">Showing featured content</p>
      </div>
    );
  }

  /**
   * Render empty state
   * Shows message if no items are available
   */
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No featured content available</p>
      </div>
    );
  }

  /**
   * Render carousel with items
   * Uses embla-carousel for smooth scrolling and navigation
   */
  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {items.map((item) => (
          <CarouselItem
            key={item.id}
            className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5"
          >
            {/* Individual carousel item card */}
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group bg-[#1a1a2e] border-[#2d2d44]">
              {/* Image container with overlay */}
              <div className="relative h-64 overflow-hidden bg-[#0f0f1e]">
                {item.posterUrl && (
                  <Image
                    src={item.posterUrl}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                )}
                {/* Overlay gradient on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Content section */}
              <div className="p-4">
                {/* Title */}
                <h3 className="text-sm font-semibold text-[#e5e5ff] truncate mb-2">
                  {item.title}
                </h3>

                {/* Description (if available) */}
                {item.description && (
                  <p className="text-xs text-[#9ca3af] line-clamp-2 mb-3">
                    {item.description}
                  </p>
                )}

                {/* Metadata row */}
                <div className="flex items-center justify-between gap-2">
                  {/* Rating badge */}
                  {item.rating && (
                    <Badge className="bg-[#ec4899]/20 text-[#ec4899] text-xs">
                      ⭐ {item.rating.toFixed(1)}
                    </Badge>
                  )}

                  {/* Type badge */}
                  {item.type && (
                    <Badge className="bg-[#a855f7]/20 text-[#a855f7] text-xs">
                      {item.type.toUpperCase()}
                    </Badge>
                  )}

                  {/* Year (if available) */}
                  {item.year && (
                    <span className="text-xs text-[#6b7280]">{item.year}</span>
                  )}
                </div>
              </div>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>

      {/* Navigation buttons */}
      <CarouselPrevious className="hidden md:flex -left-12 border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10" />
      <CarouselNext className="hidden md:flex -right-12 border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10" />
    </Carousel>
  );
}
