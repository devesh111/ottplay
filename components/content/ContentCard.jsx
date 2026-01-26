"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Play, Plus } from "lucide-react";

/**
 * ContentCard component - Displays a single content item (movie/show) as a card
 * Shows poster image with hover overlay containing title, description, and action buttons
 * Supports bilingual display (English and Arabic)
 *
 * Features:
 * - Responsive card layout with hover effects
 * - Image fallback with title text
 * - Bilingual support (English/Arabic)
 * - Rating badge display
 * - Play and Add to Watchlist buttons
 * - Link to content detail page
 *
 * @param {Object} props - Component props
 * @param {string} props.id - Unique content identifier
 * @param {string} props.title - Content title in English
 * @param {string} props.titleAr - Content title in Arabic
 * @param {string} props.description - Content description in English
 * @param {string} props.descriptionAr - Content description in Arabic
 * @param {string} props.posterUrl - URL to poster image
 * @param {string} props.thumbnailUrl - URL to thumbnail image
 * @param {number} props.rating - Content rating (0-10)
 * @param {string} props.type - Content type ('movie' or 'show')
 * @param {string} [props.language='en'] - Current language ('en' or 'ar')
 * @returns {JSX.Element} Content card component
 */
export function ContentCard({
    id,
    title,
    titleAr,
    description,
    descriptionAr,
    posterUrl,
    thumbnailUrl,
    rating,
    type,
    language = "en",
}) {
    const displayTitle = language === "en" ? title : titleAr;
    const displayDescription = language === "en" ? description : descriptionAr;

    return (
        <Link href={`/content/${type}/${id}`}>
            <div className="relative group cursor-pointer h-80 rounded-lg overflow-hidden bg-gray-200">
                {thumbnailUrl ? (
                    <img
                        src={thumbnailUrl}
                        alt={displayTitle}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-300 to-gray-400">
                        <span className="text-gray-600 text-center px-4">
                            {displayTitle}
                        </span>
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <h3 className="text-white font-bold text-lg mb-2">
                        {displayTitle}
                    </h3>
                    <p className="text-gray-200 text-sm mb-4 line-clamp-2">
                        {displayDescription}
                    </p>
                    <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                            <Play className="w-4 h-4 mr-2" />
                            {language === "en" ? "Play" : "تشغيل"}
                        </Button>
                        <Button size="sm" variant="outline">
                            <Plus className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold">
                    ⭐ {rating.toFixed(1)}
                </div>
            </div>
        </Link>
    );
}
