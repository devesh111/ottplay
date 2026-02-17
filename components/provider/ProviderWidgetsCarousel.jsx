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
import { fetchProviderCarouselItems } from "@/lib/api/ottplay";

export function ProviderWidgetCarousel({ params }) {
    const [items, setItems] = useState([]);
    const [widgetTitle, setWidgetTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [carouselApi, setCarouselApi] = useState(null);

    useEffect(() => {
        const loadWidgetItems = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchProviderCarouselItems(params);
                // console.log(response);
                const widgetItems = response?.rank || [];
                // console.log("New Releases:", newReleaseItems);
                setItems(widgetItems);
                setWidgetTitle(response?.title || "");
            } catch (err) {
                console.error("Failed to data:", err);
                setError("Failed to load data");
            } finally {
                setLoading(false);
            }
        };

        loadWidgetItems();
    }, []);

    /* Handle previous button click */
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

    /* Get image URL from item based on content type */
    const getImageUrl = (item) => {
        return item.movie?.posters[0] || item.show?.posters[0] || null;
    };

    /* Get item title based on content type */
    const getItemTitle = (item) => {
        return item.movie?.name || item.show?.name || "Content";
    };

    /**
     * Get SEO URL for the item */
    const getSeoUrl = (item) => {
        return "movie" in item
            ? "/movie/" + item.movie?.seo_url
            : "show" in item
              ? "/show/" + item.show?.seo_url
              : "#";
    };

    /* Render loading skeleton */
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

    /* Render error state */
    if (error) {
        return (
            <div className="text-center py-8">
                <p className="text-red-500 text-lg">{error}</p>
                <p className="text-gray-400 text-sm mt-2">
                    Failed to load data
                </p>
            </div>
        );
    }

    /* Render empty state */
    if (items.length === 0) {
        return <div></div>;
    }

    return (
        <div className="w-full">
            {/* Section Title */}
            <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">
                {widgetTitle}
            </h2>

            {/* Main Carousel Container  */}
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
                                const seoUrl = getSeoUrl(item);

                                return (
                                    <CarouselItem
                                        key={item.order || index}
                                        className="pl-2 md:pl-4 basis-1/3 sm:basis-1/3 md:basis-1/6"
                                    >
                                        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group h-full m-0 p-0">
                                            <Link href={seoUrl}>
                                                <div
                                                    className="relative w-full"
                                                    style={{
                                                        aspectRatio: "2/3",
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

                {/* Next Arrow Button */}
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
