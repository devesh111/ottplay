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
import { fetchCarouselItems } from "@/lib/api/ottplay";

/**
 * ProvidersCarousel Component
 * Fetches and displays providers ;ist in a carousel format with manual navigation
 */
export function ProviderCarousel() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselApi, setCarouselApi] = useState(null);

    /**
     * Fetch provider items on component mount
     * Uses the providers endpoint with specific parameters
     */
    useEffect(() => {
        const loadProviders = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchCarouselItems({
                    module_name: "Subscription",
                    platform: "web",
                    section: "widget__oTTplay_partners",
                    limit: 100,
                    title: "OTTplay+partners",
                    template_name: "providers",
                    pin_it: false,
                });

                const providerItems = response?.rank || [];
                console.log("Providers:", providerItems);
                setItems(providerItems);
            } catch (err) {
                console.error("Failed to load providers:", err);
                setError("Failed to load providers list");
                // Set mock data for development/fallback
                setMockItems();
            } finally {
                setLoading(false);
            }
        };

        loadProviders();
    }, []);

    /**
     * Set mock provider items for development/fallback
     * Provides placeholder data when API is unavailable
     */
    const setMockItems = () => {
        const mockData = Array.from({ length: 15 }, (_, i) => ({
            id: `providers-${i}`,
            title: `Providers ${i + 1}`,
            description: "Provider",
            posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
            seo_url: `/content/providers-${i}`,
            type: i % 2 === 0 ? "Provider" : "Provider",
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
        return item.provider?.logo_url || null;
    };

    /**
     * Get item title based on content type
     * @param {object} item - The carousel item
     * @returns {string} Item title
     */
    const getItemTitle = (item) => {
        return item.provider?.name || "No Provider";
    };

    /**
     * Get SEO URL for the item
     * @param {object} item - The carousel item
     * @returns {string} SEO URL for linking
     */
    const getSeoUrl = (item) => {
        return "/ott-platform/" + item.provider?.seourl || "#";
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
                    Showing Providers
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
                <p className="text-gray-400">No providers available</p>
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
            <h2 className="text-2xl font-bold text-white mb-6">OTT Specials</h2>

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
                                        className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/6"
                                    >
                                        {/* Link wrapper for navigation */}

                                        {/* Individual carousel item card - no padding */}
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full m-0 p-0">
                                            {/* Image container with dynamic aspect ratio */}
                                            <Link href={seoUrl}>
                                                <div
                                                    className="relative w-full"
                                                    style={{
                                                        aspectRatio: "199/112",
                                                    }}
                                                >
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={itemTitle}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            priority={
                                                                index === 0
                                                            }
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                                            <span className="text-gray-400 text-center px-2">
                                                                {itemTitle}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Overlay with title - Show on hover */}
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                                        <h3 className="text-white font-bold text-sm line-clamp-2">
                                                            {itemTitle}
                                                        </h3>
                                                    </div>
                                                </div>
                                            </Link>
                                        </Card>
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
