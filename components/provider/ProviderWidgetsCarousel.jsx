"use client";

import Image from "next/image";
import Link from "next/link";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

/**
 * ProviderWidgetCarousel — Client Component (interactive only).
 * Receives `items` and `widgetTitle` as props from the Server Component parent.
 */
export function ProviderWidgetCarousel({ items = [], widgetTitle = "" }) {
    const [carouselApi, setCarouselApi] = useState(null);

    const getImageUrl = (item) => {
        const image =
            item.movie?.posters?.[0] ||
            item.show?.posters?.[0] ||
            item.sport?.posters?.[0] ||
            null;
        return image ? image.split("?")[0] : image;
    };

    const getItemTitle = (item) =>
        item.movie?.name || item.show?.name || item.sport?.name || "Content";

    const getSeoUrl = (item) =>
        "movie" in item
            ? "/movie/" + item.movie?.seo_url
            : "show" in item
            ? "/show/" + item.show?.seo_url
            : "sport" in item
            ? "/sports/" + item.sport?.format + "/" + item.sport?.seo_url
            : "#";

    if (items.length === 0) return <div />;

    return (
        <div className="w-full">
            {widgetTitle && (
                <h2 className="text-xl font-semibold text-white mb-6 tracking-wide">
                    {widgetTitle}
                </h2>
            )}

            <div className="relative w-full flex items-center justify-center">
                <button
                    onClick={() => carouselApi?.scrollPrev()}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>

                <div className="w-full overflow-hidden">
                    <Carousel
                        className="w-full"
                        setApi={setCarouselApi}
                        opts={{ align: "start", loop: true }}
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
                                                <div className="relative w-full" style={{ aspectRatio: "2/3" }}>
                                                    {imageUrl ? (
                                                        <Image
                                                            src={imageUrl}
                                                            alt={itemTitle}
                                                            fill
                                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                            priority={index === 0}
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                                            <span className="text-gray-400 text-center px-2">{itemTitle}</span>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                                        <h3 className="text-white font-bold text-sm line-clamp-2">{itemTitle}</h3>
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

                <button
                    onClick={() => carouselApi?.scrollNext()}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-[#ec4899]/80 hover:bg-[#ec4899] text-white transition-all duration-300"
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </div>
    );
}
