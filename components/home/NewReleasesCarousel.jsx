/**
 * New Releases Carousel Component
 * Displays a carousel of newly released content items from the OTTplay API
 * Features:
 * - 6 slides visible on desktop, 1 on mobile
 * - No autoplay (manual navigation only)
 * - Next/Previous arrow buttons
 * - No bullet point navigation
 * - Shows item name on hover
 * - Links to content using seo_url
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Skeleton from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * NewReleasesCarousel Component
 * Fetches and displays new release content in a carousel format with manual navigation
 */
export function NewReleasesCarousel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselApi, setCarouselApi] = useState(null);

    /**
     * Fetch new releases items on component mount
     * Uses the new_release endpoint with specific parameters
     */
    useEffect(() => {
        const loadNewReleases = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch new releases using the widget_new_release_27 section
                const response = await fetch(
                    'https://api2.ottplay.com/api/v4.7/web/ranking?module_name=Subscription&platform=web&section=widget_new_release_27&limit=15&pin_it=true&title=NewReleases&template_name=new_releases',
                    {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer F421D63D166CA343454DD833B599C',
                            'source': 'web',
                            'platform': 'web',
                            'apiVersion': '1',
                        },
                    }
                );

                // Check if response is successful
                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} ${response.statusText}`);
                }

                // Parse and extract items from response
                const data = await response.json();
                const newReleaseItems = data?.rank || [];
                console.log('New Releases:', newReleaseItems);
                setItems(newReleaseItems);
            } catch (err) {
                console.error("Failed to load new releases:", err);
                setError("Failed to load new releases");
                // Set mock data for development/fallback
                setMockItems();
            } finally {
                setLoading(false);
            }
        };

        loadNewReleases();
    }, []);

    /**
     * Set mock new release items for development/fallback
     * Provides placeholder data when API is unavailable
     */
    const setMockItems = () => {
        const mockData = Array.from({ length: 15 }, (_, i) => ({
            id: `new-release-${i}`,
            title: `New Release ${i + 1}`,
            description: "A newly released content item",
            posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
            seo_url: `/content/new-release-${i}`,
            type: i % 2 === 0 ? "movie" : "show",
            year: 2026,
        }));
        setItems(mockData);
    };

    /**
     * Handle previous button click
     */
    const handlePrevious = () => {
        if (carouselApi) {
            carouselApi.scrollPrev();
        }
    };

    /**
     * Handle next button click
     */
    const handleNext = () => {
        if (carouselApi) {
            carouselApi.scrollNext();
        }
    };

    /**
     * Get image URL from item based on content type
     * Handles different content types (movie, show, sport)
     * @param {object} item - The carousel item
     * @returns {string} Image URL
     */
    const getImageUrl = (item) => {
        if (item.content_type === "sport" && item.sport?.backdrops?.[0]) {
            return item.sport.backdrops[0].url || item.sport.backdrops[0];
        } else if (item.content_type === "movie" && item.movie?.backdrops?.[0]) {
            return item.movie.backdrops[0].url || item.movie.backdrops[0];
        } else if (item.content_type === "show" && item.show?.backdrops?.[0]) {
            return item.show.backdrops[0].url || item.show.backdrops[0];
        }
        return null;
    };

    /**
     * Get item title based on content type
     * @param {object} item - The carousel item
     * @returns {string} Item title
     */
    const getItemTitle = (item) => {
        if (item.content_type === "sport") return item.sport?.name || "Sport";
        if (item.content_type === "movie") return item.movie?.name || "Movie";
        if (item.content_type === "show") return item.show?.name || "Show";
        return "Content";
    };

    /**
     * Get SEO URL for the item
     * @param {object} item - The carousel item
     * @returns {string} SEO URL for linking
     */
    const getSeoUrl = (item) => {
        if (item.content_type === "sport" && item.sport?.seo_url) {
            return item.sport.seo_url;
        } else if (item.content_type === "movie" && item.movie?.seo_url) {
            return item.movie.seo_url;
        } else if (item.content_type === "show" && item.show?.seo_url) {
            return item.show.seo_url;
        }
        return "#";
    };

    /**
     * Render loading skeleton
     * Shows placeholder cards while data is loading
     */
    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-48 rounded-lg" />
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
                <p className="text-gray-400 text-sm mt-2">
                    Showing new releases
                </p>
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
                <p className="text-gray-400">No new releases available</p>
            </div>
        );
    }

    /**
     * Render carousel with items and manual navigation
     * 6 slides visible on desktop, 1 on mobile
     * Uses embla-carousel for smooth scrolling and navigation
     */
    return (
        <div className="w-full">
            {/* Section Title */}
            <h2 className="text-2xl font-bold text-white mb-6">New Releases</h2>

            {/* Main Carousel Container with Arrow Buttons */}
            <div className="relative w-full flex items-center justify-center">
                {/* Previous Arrow Button - Always Visible */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Carousel - Hide scrollbar */}
                <div className="w-full overflow-hidden">
                    <Carousel
                        className="w-full"
                        setApi={setCarouselApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                    >
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {items.map((item, index) => {
                                const imageUrl = getImageUrl(item);
                                const itemTitle = getItemTitle(item);
                                const seoUrl = getSeoUrl(item);

                                return (
                                    <CarouselItem
                                        key={item.order || index}
                                        className="pl-2 md:pl-4 basis-full sm:basis-full md:basis-1/6"
                                    >
                                        {/* Link wrapper for navigation */}
                                        <Link href={seoUrl} className="block h-full">
                                            {/* Individual carousel item card - no padding */}
                                            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full m-0 p-0">
                                                {/* Image container with dynamic aspect ratio */}
                                                <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={itemTitle}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            priority={index === 0}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                                            <span className="text-gray-400 text-center px-2">
                                                                {itemTitle}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Overlay with title - Show on hover */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                                        <h3 className="text-white font-bold text-sm line-clamp-2">
                                                            {itemTitle}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </Card>
                                        </Link>
                                    </CarouselItem>
                                );
                            })}
                        </CarouselContent>
                    </Carousel>
                </div>

                {/* Next Arrow Button - Always Visible */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
