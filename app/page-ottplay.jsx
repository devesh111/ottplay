"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
    useNewReleases,
    useOTTPartners,
    useWidgetList,
} from "@/hooks/useOTTplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { ContentCard } from "@/components/content/ContentCard";
import HeroSection from "@/components/home/HeroSection";
import { Footer } from "@/components/layout/Footer";

/**
 * Home Page Component
 * Displays OTTplay content including:
 * - Widget list (featured content)
 * - New releases
 * - OTT partners/providers
 * 
 * Uses custom hooks to fetch data from OTTplay API
 */
export default function Home() {
    const [language, setLanguage] = useState("en");

    // Fetch data from OTTplay APIs using custom hooks
    const { data: widgetData, loading: widgetLoading, error: widgetError } = useWidgetList();
    const { data: newReleasesData, loading: newReleasesLoading, error: newReleasesError } = useNewReleases();
    const { data: partnersData, loading: partnersLoading, error: partnersError } = useOTTPartners();

    // Load language preference from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    /**
     * Transform API response data into content card format
     * Handles different API response structures
     * @param {Array} items - Items from API response
     * @returns {Array} Formatted items for display
     */
    const transformContentData = (items) => {
        if (!items || !Array.isArray(items)) return [];
        
        return items.map((item) => ({
            id: item.id || item.ottplay_id || item._id,
            title: item.title || item.name || "Untitled",
            titleAr: item.titleAr || item.title_ar || item.title,
            description: item.description || item.synopsis || "",
            descriptionAr: item.descriptionAr || item.description_ar || "",
            posterUrl: item.poster_url || item.posterUrl || item.image_url || "",
            thumbnailUrl: item.thumbnail_url || item.thumbnailUrl || item.image_url || "",
            rating: item.rating || item.imdb_rating || 0,
            type: item.type || item.content_type || "movie",
            language: item.language || "en",
        }));
    };

    /**
     * Extract content items from widget data
     * Handles nested widget structure from API
     * @param {Object} data - Widget data from API
     * @returns {Array} Content items
     */
    const extractWidgetContent = (data) => {
        if (!data) return [];
        
        // Handle different response structures
        if (Array.isArray(data)) return transformContentData(data);
        if (data.widgets && Array.isArray(data.widgets)) {
            return transformContentData(data.widgets.flatMap(w => w.items || []));
        }
        if (data.items && Array.isArray(data.items)) {
            return transformContentData(data.items);
        }
        if (data.data && Array.isArray(data.data)) {
            return transformContentData(data.data);
        }
        
        return [];
    };

    // Transform API data for display
    const widgetContent = extractWidgetContent(widgetData);
    const newReleases = extractWidgetContent(newReleasesData);
    const partners = extractWidgetContent(partnersData);

    // Translations for UI text
    const translations = {
        en: {
            welcome: "Welcome to OTTplay",
            featuredContent: "Featured Content",
            newReleases: "New Releases",
            ottPartners: "OTT Partners",
            viewAll: "View All",
            play: "Play",
            addToWatchlist: "Add to Watchlist",
            rating: "Rating",
            noContent: "No content available",
            loading: "Loading...",
            error: "Failed to load content",
        },
        ar: {
            welcome: "مرحبا بك في OTTplay",
            featuredContent: "المحتوى المميز",
            newReleases: "الإصدارات الجديدة",
            ottPartners: "شركاء OTT",
            viewAll: "عرض الكل",
            play: "تشغيل",
            addToWatchlist: "إضافة إلى قائمة المشاهدة",
            rating: "التقييم",
            noContent: "لا يوجد محتوى متاح",
            loading: "جاري التحميل...",
            error: "فشل تحميل المحتوى",
        },
    };

    const t = translations[language];

    /**
     * Render carousel with content items
     * Handles loading, error, and empty states
     * @param {Array} items - Content items to display
     * @param {boolean} loading - Loading state
     * @param {string} error - Error message
     * @param {string} emptyMessage - Message when no content
     * @returns {JSX} Carousel component or fallback
     */
    const renderCarousel = (items, loading, error, emptyMessage) => {
        // Show loading skeleton
        if (loading) {
            return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-80 rounded-lg" />
                    ))}
                </div>
            );
        }

        // Show error message
        if (error) {
            return (
                <div className="text-red-500 text-center py-8">
                    {t.error}: {error}
                </div>
            );
        }

        // Show empty state
        if (items.length === 0) {
            return (
                <div className="text-center py-8 text-gray-500">
                    {emptyMessage}
                </div>
            );
        }

        // Render carousel with content
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

    return (
        <main className="min-h-screen bg-[#0f0f1e]">
            {/* Hero Section */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6">
                <HeroSection />
            </div>

            {/* Featured Content Section - From Widget List API */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#e5e5ff]">
                        {t.featuredContent}
                    </h2>
                    <Link href="/content/featured">
                        <Button variant="outline" className="border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(
                    widgetContent,
                    widgetLoading,
                    widgetError,
                    t.noContent
                )}
            </section>

            {/* New Releases Section - From New Release API */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ec4899] to-[#a855f7] bg-clip-text text-transparent">
                        {t.newReleases}
                    </h2>
                    <Link href="/content/new">
                        <Button variant="outline" className="border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(
                    newReleases,
                    newReleasesLoading,
                    newReleasesError,
                    t.noContent
                )}
            </section>

            {/* OTT Partners Section - From OTT Partners API */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#10b981] bg-clip-text text-transparent">
                        {t.ottPartners}
                    </h2>
                    <Link href="/providers">
                        <Button variant="outline" className="border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(
                    partners,
                    partnersLoading,
                    partnersError,
                    t.noContent
                )}
            </section>

            {/* Call to Action Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
                        {language === "en"
                            ? "Ready to Start Watching?"
                            : "هل أنت مستعد للبدء في المشاهدة؟"}
                    </h2>
                    <p className="text-lg text-[#9ca3af] mb-8">
                        {language === "en"
                            ? "Explore thousands of movies and TV shows from your favorite OTT platforms"
                            : "استكشف آلاف الأفلام والمسلسلات من منصات OTT المفضلة لديك"}
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
                        {language === "en" ? "Explore Now" : "استكشف الآن"}
                    </button>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
