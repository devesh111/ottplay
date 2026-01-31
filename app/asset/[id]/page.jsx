"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    useMovieDetails,
    useShowDetails,
    useEpisodeDetails,
    useLiveTVDetails,
    useSportsDetails,
} from "@/hooks/useOTTplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";

/**
 * Asset Details Page Component
 * Displays detailed information about a specific asset (movie, show, live TV, sports)
 * Supports multiple content types with dynamic data fetching
 * 
 * Features:
 * - Movie details with cast, crew, ratings
 * - TV show details with episode list
 * - Live TV channel information
 * - Sports event details
 * - Responsive design with image gallery
 */
export default function AssetDetailsPage() {
    const params = useParams();
    const [language, setLanguage] = useState("en");
    const [contentType, setContentType] = useState("movie");
    const [seoUrl, setSeoUrl] = useState("");

    // Fetch different content types based on contentType
    const movieDetails = useMovieDetails(contentType === "movie" ? seoUrl : null);
    const showDetails = useShowDetails(contentType === "show" ? seoUrl : null);
    const episodeDetails = useEpisodeDetails(contentType === "show" ? seoUrl : null);
    const liveTVDetails = useLiveTVDetails(contentType === "livetv" ? seoUrl : null);
    const sportsDetails = useSportsDetails(contentType === "sports" ? params.id : null);

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);

        // Parse ID to extract content type and SEO URL
        if (params.id) {
            const decodedId = decodeURIComponent(params.id);
            // Format: type-seoUrl (e.g., movie-border-1997/eb2e1a54e1160)
            const parts = decodedId.split("-");
            if (parts.length > 1) {
                setContentType(parts[0]);
                setSeoUrl(parts.slice(1).join("-"));
            }
        }
    }, [params.id]);

    // Select appropriate data based on content type
    const getActiveData = () => {
        switch (contentType) {
            case "movie":
                return movieDetails;
            case "show":
                return showDetails;
            case "livetv":
                return liveTVDetails;
            case "sports":
                return sportsDetails;
            default:
                return movieDetails;
        }
    };

    const activeData = getActiveData();
    const data = activeData.data?.data || activeData.data;

    const translations = {
        en: {
            title: "Asset Details",
            loading: "Loading details...",
            error: "Failed to load asset details",
            cast: "Cast",
            crew: "Crew",
            episodes: "Episodes",
            synopsis: "Synopsis",
            rating: "Rating",
            releaseDate: "Release Date",
            duration: "Duration",
            language: "Language",
            genres: "Genres",
            watchNow: "Watch Now",
            addToWatchlist: "Add to Watchlist",
            share: "Share",
            moreInfo: "More Information",
        },
        ar: {
            title: "تفاصيل الأصل",
            loading: "جاري تحميل التفاصيل...",
            error: "فشل تحميل تفاصيل الأصل",
            cast: "الممثلون",
            crew: "الطاقم",
            episodes: "الحلقات",
            synopsis: "الملخص",
            rating: "التقييم",
            releaseDate: "تاريخ الإصدار",
            duration: "المدة",
            language: "اللغة",
            genres: "الأنواع",
            watchNow: "شاهد الآن",
            addToWatchlist: "إضافة إلى قائمة المشاهدة",
            share: "مشاركة",
            moreInfo: "معلومات إضافية",
        },
    };

    const t = translations[language];

    if (activeData.loading) {
        return (
            <main className="min-h-screen bg-[#0f0f1e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Skeleton className="h-96 rounded-lg mb-8" />
                    <Skeleton className="h-32 rounded-lg mb-8" />
                    <Skeleton className="h-64 rounded-lg" />
                </div>
            </main>
        );
    }

    if (activeData.error || !data) {
        return (
            <main className="min-h-screen bg-[#0f0f1e]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="text-center">
                        <p className="text-red-500 text-lg">{t.error}</p>
                        <p className="text-[#9ca3af] mt-2">{activeData.error}</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#0f0f1e]">
            {/* Hero Section with Backdrop */}
            <section className="relative h-96 bg-[#1a1a2e] overflow-hidden">
                {data.backdrop_url || data.posterUrl && (
                    <img
                        src={data.backdrop_url || data.posterUrl}
                        alt={data.title || data.name}
                        className="w-full h-full object-cover opacity-50"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f1e] to-transparent" />
            </section>

            {/* Content Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Poster */}
                    <div className="md:col-span-1">
                        {data.poster_url || data.posterUrl && (
                            <img
                                src={data.poster_url || data.posterUrl}
                                alt={data.title || data.name}
                                className="w-full rounded-lg shadow-2xl"
                            />
                        )}
                    </div>

                    {/* Details */}
                    <div className="md:col-span-3">
                        <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e5ff] mb-4">
                            {data.title || data.name}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            {data.rating && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">{t.rating}:</span>
                                    <span className="text-[#fbbf24] font-semibold">
                                        {data.rating}/10
                                    </span>
                                </div>
                            )}
                            {data.release_date && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">{t.releaseDate}:</span>
                                    <span className="text-[#e5e5ff]">
                                        {new Date(data.release_date).getFullYear()}
                                    </span>
                                </div>
                            )}
                            {data.duration && (
                                <div className="flex items-center gap-2">
                                    <span className="text-[#9ca3af]">{t.duration}:</span>
                                    <span className="text-[#e5e5ff]">{data.duration}</span>
                                </div>
                            )}
                        </div>

                        {/* Genres */}
                        {data.genres && (
                            <div className="mb-6">
                                <p className="text-[#9ca3af] mb-2">{t.genres}:</p>
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(data.genres) ? data.genres : [data.genres]).map(
                                        (genre, idx) => (
                                            <span
                                                key={idx}
                                                className="px-3 py-1 rounded-full bg-[#1a1a2e] border border-[#2d2d44] text-[#e5e5ff] text-sm"
                                            >
                                                {genre}
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Synopsis */}
                        {data.description || data.synopsis && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-[#e5e5ff] mb-3">
                                    {t.synopsis}
                                </h2>
                                <p className="text-[#9ca3af] leading-relaxed">
                                    {data.description || data.synopsis}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Button className="px-8 py-3 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white font-semibold hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all">
                                {t.watchNow}
                            </Button>
                            <Button
                                variant="outline"
                                className="px-8 py-3 rounded-lg border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10"
                            >
                                {t.addToWatchlist}
                            </Button>
                            <Button
                                variant="outline"
                                className="px-8 py-3 rounded-lg border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10"
                            >
                                {t.share}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Cast Section */}
                {data.cast && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-[#e5e5ff] mb-6">{t.cast}</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                            {(Array.isArray(data.cast) ? data.cast : [data.cast]).slice(0, 6).map(
                                (member, idx) => (
                                    <Card
                                        key={idx}
                                        className="bg-[#1a1a2e] border-[#2d2d44] overflow-hidden"
                                    >
                                        {member.image && (
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        <div className="p-3">
                                            <p className="text-sm font-semibold text-[#e5e5ff] truncate">
                                                {member.name}
                                            </p>
                                            {member.character && (
                                                <p className="text-xs text-[#9ca3af] truncate">
                                                    {member.character}
                                                </p>
                                            )}
                                        </div>
                                    </Card>
                                )
                            )}
                        </div>
                    </section>
                )}

                {/* Episodes Section (for TV shows) */}
                {contentType === "show" && episodeDetails.data && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-[#e5e5ff] mb-6">{t.episodes}</h2>
                        <div className="space-y-4">
                            {(episodeDetails.data.episodes || []).slice(0, 10).map((episode, idx) => (
                                <Card
                                    key={idx}
                                    className="bg-[#1a1a2e] border-[#2d2d44] p-4 hover:border-[#ec4899] transition-all cursor-pointer"
                                >
                                    <div className="flex gap-4">
                                        {episode.thumbnail && (
                                            <img
                                                src={episode.thumbnail}
                                                alt={episode.title}
                                                className="w-24 h-16 object-cover rounded"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-[#e5e5ff]">
                                                {episode.title}
                                            </h3>
                                            {episode.description && (
                                                <p className="text-sm text-[#9ca3af] mt-1 line-clamp-2">
                                                    {episode.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
