"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiClient } from "@/lib/api/client";
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

export default function Home() {
    const [language, setLanguage] = useState("en");
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [trendingContent, setTrendingContent] = useState([]);
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [bestTVShows, setBestTVShows] = useState([]);
    const [newReleases, setNewReleases] = useState([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [showsLoading, setShowsLoading] = useState(true);
    const [contentLoading, setContentLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");
    const [showsError, setShowsError] = useState("");

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    // Fetch featured movies
    useEffect(() => {
        const fetchMovies = async () => {
            try {
                setMoviesLoading(true);
                const response = await apiClient.get("/content/movies", {
                    params: {
                        limit: 10,
                        lang: language,
                    },
                });
                setMovies(response.data.data || []);
            } catch (err) {
                setMoviesError(
                    err.response?.data?.message || "Failed to load movies",
                );
                setMockMovies();
            } finally {
                setMoviesLoading(false);
            }
        };

        fetchMovies();
    }, [language]);

    // Fetch featured shows
    useEffect(() => {
        const fetchShows = async () => {
            try {
                setShowsLoading(true);
                const response = await apiClient.get("/content/shows", {
                    params: {
                        limit: 10,
                        lang: language,
                    },
                });
                setShows(response.data.data || []);
            } catch (err) {
                setShowsError(
                    err.response?.data?.message || "Failed to load shows",
                );
                setMockShows();
            } finally {
                setShowsLoading(false);
            }
        };

        fetchShows();
    }, [language]);

    // Fetch other content sections
    useEffect(() => {
        const fetchContent = async () => {
            try {
                setContentLoading(true);
                
                // Fetch different content categories
                const [trending, upcoming, bestTV, newRel] = await Promise.all([
                    apiClient.get("/content?category=trending&limit=10"),
                    apiClient.get("/content?category=upcoming&limit=10"),
                    apiClient.get("/content?category=best-tv&limit=10"),
                    apiClient.get("/content?category=new-releases&limit=10"),
                ]);

                setTrendingContent(trending?.data?.data || []);
                setUpcomingMovies(upcoming?.data?.data || []);
                setBestTVShows(bestTV?.data?.data || []);
                setNewReleases(newRel?.data?.data || []);
            } catch (error) {
                console.error('Error fetching content:', error);
                // Set mock data for development
                setMockContent();
            } finally {
                setContentLoading(false);
            }
        };

        fetchContent();
    }, []);

    const setMockMovies = () => {
        const mockItems = Array.from({ length: 10 }, (_, i) => ({
            id: `movie-${i}`,
            title: `Movie Title ${i + 1}`,
            titleAr: `عنوان الفيلم ${i + 1}`,
            description: `This is a great movie with amazing storyline and excellent cast.`,
            descriptionAr: `هذا فيلم رائع بقصة مذهلة وفريق ممثلين ممتاز.`,
            posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop`,
            rating: 8.5 + Math.random() * 1.5,
            type: 'movie',
            language: 'en',
        }));

        setMovies(mockItems);
    };

    const setMockShows = () => {
        const mockItems = Array.from({ length: 10 }, (_, i) => ({
            id: `show-${i}`,
            title: `Show Title ${i + 1}`,
            titleAr: `عنوان المسلسل ${i + 1}`,
            description: `This is an amazing TV show with great storyline.`,
            descriptionAr: `هذا مسلسل رائع بقصة عظيمة.`,
            posterUrl: `https://images.unsplash.com/photo-1522869635100-ce306e08e8de?w=300&h=450&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-1522869635100-ce306e08e8de?w=500&h=300&fit=crop`,
            rating: 8.0 + Math.random() * 2,
            type: 'show',
            language: 'en',
        }));

        setShows(mockItems);
    };

    const setMockContent = () => {
        const mockItems = Array.from({ length: 10 }, (_, i) => ({
            id: `content-${i}`,
            title: `Content Title ${i + 1}`,
            titleAr: `عنوان المحتوى ${i + 1}`,
            description: `This is great content with amazing storyline.`,
            descriptionAr: `هذا محتوى رائع بقصة مذهلة.`,
            posterUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop`,
            thumbnailUrl: `https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&h=300&fit=crop`,
            rating: 8.5 + Math.random() * 1.5,
            type: i % 2 === 0 ? 'movie' : 'show',
            language: 'en',
        }));

        setTrendingContent(mockItems);
        setUpcomingMovies(mockItems);
        setBestTVShows(mockItems);
        setNewReleases(mockItems);
    };

    const translations = {
        en: {
            welcome: "Welcome to OTT Platform",
            featuredMovies: "Featured Movies",
            featuredShows: "Featured Shows",
            trendingNow: "Trending Now",
            upcomingMovies: "Upcoming Movies",
            bestInTV: "Best in TV",
            newReleases: "New Releases",
            viewAll: "View All",
            play: "Play",
            addToWatchlist: "Add to Watchlist",
            rating: "Rating",
            year: "Year",
            noMovies: "No movies available",
            noShows: "No shows available",
        },
        ar: {
            welcome: "مرحبا بك في منصة OTT",
            featuredMovies: "الأفلام المميزة",
            featuredShows: "المسلسلات المميزة",
            trendingNow: "الاتجاهات الآن",
            upcomingMovies: "الأفلام القادمة",
            bestInTV: "الأفضل في التلفاز",
            newReleases: "الإصدارات الجديدة",
            viewAll: "عرض الكل",
            play: "تشغيل",
            addToWatchlist: "إضافة إلى قائمة المشاهدة",
            rating: "التقييم",
            year: "السنة",
            noMovies: "لا توجد أفلام متاحة",
            noShows: "لا توجد مسلسلات متاحة",
        },
    };

    const t = translations[language];

    const renderCarousel = (items, loading, error, noDataMessage) => {
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
            return (
                <div className="text-red-500 text-center py-8">
                    {error}
                </div>
            );
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

    return (
        <main className="min-h-screen bg-[#0f0f1e]">
            {/* Hero Section */}
            <div className="px-4 sm:px-6 lg:px-8 pt-6">
                <HeroSection />
            </div>

            {/* Featured Movies Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#e5e5ff]">{t.featuredMovies}</h2>
                    <Link href="/content/movies">
                        <Button variant="outline" className="border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(movies, moviesLoading, moviesError, t.noMovies)}
            </section>

            {/* Featured Shows Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold text-[#e5e5ff]">{t.featuredShows}</h2>
                    <Link href="/content/shows">
                        <Button variant="outline" className="border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(shows, showsLoading, showsError, t.noShows)}
            </section>

            {/* Trending Now Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ec4899] to-[#a855f7] bg-clip-text text-transparent">
                        {t.trendingNow}
                    </h2>
                    <Link href="/content/trending">
                        <Button variant="outline" className="border-[#ec4899] text-[#ec4899] hover:bg-[#ec4899]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(trendingContent, contentLoading, "", t.noMovies)}
            </section>

            {/* Upcoming Movies Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#a855f7] to-[#10b981] bg-clip-text text-transparent">
                        {t.upcomingMovies}
                    </h2>
                    <Link href="/content/movies?filter=upcoming">
                        <Button variant="outline" className="border-[#a855f7] text-[#a855f7] hover:bg-[#a855f7]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(upcomingMovies, contentLoading, "", t.noMovies)}
            </section>

            {/* Best in TV Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#10b981] to-[#06b6d4] bg-clip-text text-transparent">
                        {t.bestInTV}
                    </h2>
                    <Link href="/content/shows?filter=best">
                        <Button variant="outline" className="border-[#10b981] text-[#10b981] hover:bg-[#10b981]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(bestTVShows, contentLoading, "", t.noShows)}
            </section>

            {/* New Releases Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 overflow-x-hidden">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-[#06b6d4] to-[#ec4899] bg-clip-text text-transparent">
                        {t.newReleases}
                    </h2>
                    <Link href="/content/new">
                        <Button variant="outline" className="border-[#06b6d4] text-[#06b6d4] hover:bg-[#06b6d4]/10">
                            {t.viewAll}
                        </Button>
                    </Link>
                </div>

                {renderCarousel(newReleases, contentLoading, "", t.noMovies)}
            </section>

            {/* Call to Action Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
                        {language === "en" ? "Ready to Start Watching?" : "هل أنت مستعد للبدء في المشاهدة؟"}
                    </h2>
                    <p className="text-lg text-[#9ca3af] mb-8">
                        {language === "en"
                            ? "Join millions of users streaming unlimited movies and TV shows with OTTPlay"
                            : "انضم إلى ملايين المستخدمين الذين يشاهدون أفلام ومسلسلات غير محدودة مع OTTPlay"}
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
                        {language === "en" ? "Subscribe Now" : "اشترك الآن"}
                    </button>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
