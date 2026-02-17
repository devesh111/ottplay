"use client";

import { useEffect, useState } from "react";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { NewReleasesCarousel } from "@/components/home/NewReleasesCarousel";

/**
 * Home Page Component
 * Main landing page that displays all widget sections
 */

import React from "react";
import { ProviderCarousel } from "@/components/home/ProviderCarousel";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ErrorDisplay from "@/components/layout/ErrorDisplay";

const Home = () => {
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Load language preference from localStorage on mount
     */
    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
        setLoading(false);
    }, []);

    /*
     * Translations for UI text
     */
    const translations = {
        en: {
            welcome: "Welcome to OTTplay",
            viewAll: "View All",
            noContent: "No content available",
            loading: "Loading...",
        },
        ar: {
            welcome: "مرحبا بك في OTTplay",
            viewAll: "عرض الكل",
            noContent: "لا يوجد محتوى متاح",
            loading: "جاري التحميل...",
        },
    };

    const t = translations[language] || translations.en;

    /**
     * Render loading state
     * Shows skeleton loaders while fetching widget data
     */
    if (loading) {
        return <LoadingSkeleton />;
    }

    /**
     * Render error state
     * Shows error message if widget list fetch fails
     */
    if (error) {
        return <ErrorDisplay />;
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Page header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {t.welcome}
                </h1>
                <p className="text-foreground mt-2">
                    Discover amazing content from around the world
                </p>
            </div>

            {/* Featured Carousel Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                <div className="overflow-hidden">
                    <FeaturedCarousel
                        params={{
                            module_name: "Home",
                            platform: "web",
                            section: "widget_mix_search",
                            limit: 50,
                            title: "Featured+Carousel",
                        }}
                    />
                </div>
            </section>

            {/* New Releases Carousel Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-10">
                <div className="overflow-hidden">
                    <NewReleasesCarousel />
                </div>
            </section>

            {/* Providers Carousel Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-10">
                <div className="overflow-hidden">
                    <ProviderCarousel />
                </div>
            </section>

            {/* Call to Action Section */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
                        {language === "en"
                            ? "Ready to Start Watching?"
                            : "هل أنت مستعد للبدء في المشاهدة؟"}
                    </h2>
                    <p className="text-lg text-[#9ca3af] mb-8">
                        {language === "en"
                            ? "Join millions of users streaming unlimited movies and TV shows with OTTplay"
                            : "انضم إلى ملايين المستخدمين الذين يشاهدون أفلام ومسلسلات غير محدودة مع OTTplay"}
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
                        {language === "en" ? "Subscribe Now" : "اشترك الآن"}
                    </button>
                </div>
            </section>
        </main>
    );
};

export default Home;
