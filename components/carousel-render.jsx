import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import { ContentCard } from "@/components/content/ContentCard";

const renderCarousel = (items, loading, error, noDataMessage, language) => {
    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-80 rounded-lg" />
                ))}
            </div>
        );
    }

    if (error) {
        return <div className="text-red-500 text-center py-8">{error}</div>;
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                {noDataMessage}
            </div>
        );
    }

    return (
        <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
                {items.map((item) => (
                    <CarouselItem
                        key={item.id}
                        className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5"
                    >
                        <ContentCard
                            id={item.id}
                            title={item.title}
                            titleAr={item.titleAr}
                            description={item.description}
                            descriptionAr={item.descriptionAr}
                            posterUrl={item.posterUrl}
                            thumbnailUrl={item.thumbnailUrl}
                            rating={item.rating}
                            type={item.type}
                            language={language}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default renderCarousel;
