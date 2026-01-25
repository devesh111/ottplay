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

export default function Home() {
    const [language, setLanguage] = useState("en");
    const [movies, setMovies] = useState([]);
    const [shows, setShows] = useState([]);
    const [moviesLoading, setMoviesLoading] = useState(true);
    const [showsLoading, setShowsLoading] = useState(true);
    const [moviesError, setMoviesError] = useState("");
    const [showsError, setShowsError] = useState("");

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    // Fetch movies independently
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
            } finally {
                setMoviesLoading(false);
            }
        };

        fetchMovies();
    }, [language]);

    // Fetch shows independently
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
            } finally {
                setShowsLoading(false);
            }
        };

        fetchShows();
    }, [language]);

    const translations = {
        en: {
            welcome: "Welcome to OTT Platform",
            featuredMovies: "Featured Movies",
            featuredShows: "Featured Shows",
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

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-linear-to-r from-blue-600 to-purple-600 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        {t.welcome}
                    </h1>
                    <p className="text-xl text-blue-100">
                        {language === "en"
                            ? "Discover thousands of movies, shows, and live TV channels"
                            : "اكتشف آلاف الأفلام والمسلسلات وقنوات التلفاز المباشرة"}
                    </p>
                </div>
            </section>

            {/* Featured Movies Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">{t.featuredMovies}</h2>
                    <Link href="/content/movies">
                        <Button variant="outline">{t.viewAll}</Button>
                    </Link>
                </div>

                {moviesLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-80 rounded-lg" />
                        ))}
                    </div>
                ) : moviesError ? (
                    <div className="text-red-500 text-center py-8">
                        {moviesError}
                    </div>
                ) : movies.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {movies.map((movie) => (
                                <CarouselItem
                                    key={movie.id}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5"
                                >
                                    <ContentCard
                                        id={movie.id}
                                        title={movie.title}
                                        titleAr={movie.titleAr}
                                        description={movie.description}
                                        descriptionAr={movie.descriptionAr}
                                        posterUrl={movie.posterUrl}
                                        rating={movie.rating}
                                        type="movie"
                                        language={language}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {t.noMovies}
                    </div>
                )}
            </section>

            {/* Featured Shows Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">{t.featuredShows}</h2>
                    <Link href="/content/shows">
                        <Button variant="outline">{t.viewAll}</Button>
                    </Link>
                </div>

                {showsLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-80 rounded-lg" />
                        ))}
                    </div>
                ) : showsError ? (
                    <div className="text-red-500 text-center py-8">
                        {showsError}
                    </div>
                ) : shows.length > 0 ? (
                    <Carousel className="w-full">
                        <CarouselContent className="-ml-2 md:-ml-4">
                            {shows.map((show) => (
                                <CarouselItem
                                    key={show.id}
                                    className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/5"
                                >
                                    <ContentCard
                                        id={show.id}
                                        title={show.title}
                                        titleAr={show.titleAr}
                                        description={show.description}
                                        descriptionAr={show.descriptionAr}
                                        posterUrl={show.posterUrl}
                                        rating={show.rating}
                                        type="show"
                                        language={language}
                                    />
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        {t.noShows}
                    </div>
                )}
            </section>
        </main>
    );
}
