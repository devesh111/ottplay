"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fetchProviderCarouselItems } from "@/lib/api/ottplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Skeleton from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import React from "react";

const ProviderFeaturedCarousel = ({ params }) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carouselApi, setCarouselApi] = useState(null);

    useEffect(() => {
        const loadCarouselItems = async () => {
            try {
                setLoading(true);
                setError(null);
                if (params.module_name !== undefined) {
                    const response = await fetchProviderCarouselItems(params);
                    const carouselItems = response?.rank || [];
                    setItems(carouselItems);
                }
            } catch (err) {
                console.error("Failed to load carousel items:", err);
                setError("Failed to load featured content");
            } finally {
                setLoading(false);
            }
        };

        loadCarouselItems();
    }, []);

    /* Set up carousel autoplay. Automatically advances to next slide every 5 seconds */
    useEffect(() => {
        if (!carouselApi) return;

        // Set up autoplay interval
        const autoplayInterval = setInterval(() => {
            carouselApi.scrollNext();
        }, 5000);

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

    /*  Handle bullet click to navigate to specific slide */
    const handleBulletClick = (index) => {
        if (carouselApi) {
            carouselApi.scrollTo(index);
            setCurrentIndex(index);
        }
    };

    /*  Handle previous button click */
    const handlePrevious = () => {
        if (carouselApi) {
            carouselApi.scrollPrev();
        }
    };

    /* Handle next button click */
    const handleNext = () => {
        if (carouselApi) {
            carouselApi.scrollNext();
        }
    };

    /* Get image URL from item based on content type (movie, show, sport) */
    const getImageUrl = (item) => {
        if (item.content_type === "sport" && item.sport?.backdrops?.[0]) {
            return item.sport.backdrops[0].url || item.sport.backdrops[0];
        } else if (
            item.content_type === "movie" &&
            item.movie?.backdrops?.[0]
        ) {
            return item.movie.backdrops[0].url || item.movie.backdrops[0];
        } else if (item.content_type === "show" && item.show?.backdrops?.[0]) {
            return item.show.backdrops[0].url || item.show.backdrops[0];
        }
        return null;
    };

    /* Get item title based on content type */
    const getItemTitle = (item) => {
        if (item.content_type === "sport") return item.sport?.name || "Sport";
        if (item.content_type === "movie") return item.movie?.name || "Movie";
        if (item.content_type === "show") return item.show?.name || "Show";
        return "Content";
    };

    /* Get item link based on content type */
    const getItemLink = (item) => {
        if (item.content_type === "movie")
            return "/movie/" + item.movie.seo_url;
        if (item.content_type === "show") return "/show/" + item.show.seo_url;
        if (item.content_type === "sport")
            return (
                "/sports/" + item?.sport?.format + "/" + item?.sport?.seo_url
            );
        return "#";
    };

    /* Render loading skeleton. Shows placeholder cards while data is loading */
    if (loading) {
        return (
            <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-80 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    /* Render error state. Shows error message if API call fails */
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

    /* Render empty state hows message if no items are available */
    if (items.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-400">No content available</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Main Carousel Container with Arrow Buttons */}
            <div className="relative w-full flex items-center justify-center">
                {/* Previous Arrow Button */}
                <button
                    onClick={handlePrevious}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

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
                                const itemLink = getItemLink(item);

                                return (
                                    <CarouselItem
                                        key={item.order || index}
                                        className="pl-2 md:pl-4 basis-full sm:basis-full md:basis-1/3"
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full m-0 p-0">
                                            <Link href={itemLink}>
                                                <div
                                                    className="relative w-full"
                                                    style={{
                                                        aspectRatio: "16/9",
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
                                                            <span className="text-gray-400">
                                                                {itemTitle}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Overlay with title and info */}
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                                        <h3 className="text-white font-bold text-lg line-clamp-2">
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

                {/* Next Arrow Button */}
                <button
                    onClick={handleNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>

            {/* Bullet Point Navigation - Centered Below Carousel */}
            <div className="flex justify-center items-center gap-2 mt-4 flex-wrap min-h-4">
                {items.map((item, index) => {
                    const isActive = index === currentIndex;

                    return (
                        <button
                            key={item.order || index}
                            onClick={() => handleBulletClick(index)}
                            className={`shrink-0 rounded-full transition-all duration-300 ${
                                isActive
                                    ? "w-3 h-3 bg-[#ec4899] scale-125"
                                    : "w-2 h-2 bg-gray-500 hover:bg-gray-400"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default ProviderFeaturedCarousel;
