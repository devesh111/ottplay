/**
 * Featured Carousel Component
 * Displays a carousel of featured content items from the OTTplay API
 * Uses the widget_mix_search section to fetch items
 * Features:
 * - Dynamic slide width based on image aspect ratio
 * - Autoplay functionality
 * - Bullet thumbnails below carousel for navigation
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchCarouselItems } from "@/lib/api/ottplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Skeleton from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

/**
 * FeaturedCarousel Component
 * Fetches and displays featured content in a carousel format with autoplay and thumbnails
 */
export function FeaturedCarousel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselApi, setCarouselApi] = useState(null);

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
                    // module_name=Home&platform=web&section=widget_mix_search&limit=50&title=Featured+Carousel
                    module_name: "Home",
                    platform: "web",
                    section: "widget_mix_search",
                    limit: 50,
                    title: "Featured+Carousel",
                });

                // Extract items from response - handle different response structures
                const carouselItems = response?.rank || [];
                console.log(carouselItems);
                setItems(carouselItems);
            } catch (err) {
                console.error("Failed to load carousel items:", err);
                setError("Failed to load featured content");
                // Set mock data for development/fallback
                setMockItems();
            } finally {
                setLoading(false);
            }
        };

        loadCarouselItems();
    }, []);

    /**
     * Set up carousel autoplay
     * Automatically advances to next slide every 5 seconds
     */
    useEffect(() => {
        if (!carouselApi) return;

        // Set up autoplay interval
        const autoplayInterval = setInterval(() => {
            carouselApi.scrollNext();
        }, 5000); // Change slide every 5 seconds

        // Listen to carousel scroll events to update current index
        const handleSelect = () => {
            setCurrentIndex(carouselApi.selectedScrollSnap());
        };

        carouselApi.on("select", handleSelect);

        // Cleanup interval and listener on unmount
        return () => {
            clearInterval(autoplayInterval);
            carouselApi.off("select", handleSelect);
        };
    }, [carouselApi]);

    /**
     * Set mock carousel items for development/fallback
     * Provides placeholder data when API is unavailable
     */
    const setMockItems = () => {
        const mockData = Array.from({ length: 10 }, (_, i) => ({
            id: `featured-${i}`,
            title: `Featured Content ${i + 1}`,
            description: "An amazing piece of content you should watch",
            posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop`,
            rating: 8.0 + Math.random() * 2,
            type: i % 2 === 0 ? "movie" : "show",
            year: 2024 - Math.floor(Math.random() * 5),
        }));
        setItems(mockData);
    };

    /**
     * Handle thumbnail click to navigate to specific slide
     * @param {number} index - Index of the slide to navigate to
     */
    const handleThumbnailClick = (index) => {
        if (carouselApi) {
            carouselApi.scrollTo(index);
            setCurrentIndex(index);
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
                <p className="text-gray-400 text-sm mt-2">
                    Showing featured content
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
                <p className="text-gray-400">No featured content available</p>
            </div>
        );
    }

    /**
     * Render carousel with items, autoplay, and thumbnail navigation
     * Uses embla-carousel for smooth scrolling and navigation
     */
    return (
        <div className="w-full">
            {/* Main Carousel */}
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

                        return (
                            <CarouselItem
                                key={item.order || index}
                                className="pl-2 md:pl-4 basis-full"
                            >
                                {/* Individual carousel item card - full width */}
                                <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
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
                                                <span className="text-gray-400">
                                                    {itemTitle}
                                                </span>
                                            </div>
                                        )}

                                        {/* Overlay with title and info */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                            <h3 className="text-white font-bold text-lg line-clamp-2">
                                                {itemTitle}
                                            </h3>
                                        </div>
                                    </div>
                                </Card>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>

                {/* Navigation buttons */}
                <CarouselPrevious className="hidden md:flex -left-12 border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10" />
                <CarouselNext className="hidden md:flex -right-12 border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10" />
            </Carousel>

            {/* Bullet Thumbnails Navigation - Centered Below Carousel */}
            <div className="flex justify-center items-center gap-3 mt-6 flex-wrap">
                {items.map((item, index) => {
                    const imageUrl = getImageUrl(item);
                    const isActive = index === currentIndex;

                    return (
                        <button
                            key={item.order || index}
                            onClick={() => handleThumbnailClick(index)}
                            className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 ${
                                isActive
                                    ? "ring-2 ring-[#ec4899] scale-110"
                                    : "opacity-60 hover:opacity-100"
                            }`}
                            style={{
                                width: "80px",
                                height: "45px",
                            }}
                            aria-label={`Go to slide ${index + 1}`}
                        >
                            {imageUrl ? (
                                <Image
                                    src={imageUrl}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900" />
                            )}

                            {/* Active indicator dot */}
                            {isActive && (
                                <div className="absolute inset-0 bg-[#ec4899]/20 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-[#ec4899] rounded-full" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
