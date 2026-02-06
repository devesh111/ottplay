"use client";
import { useEffect, useState } from "react";
import { useOTTPartners } from "@/hooks/useOTTplay";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Footer } from "@/components/layout/Footer";

/**
 * Providers Page Component
 * Displays all available OTT providers/partners
 * Fetches data from OTTplay OTT Partners API
 * 
 * Features:
 * - Grid display of all providers
 * - Provider logos and information
 * - Click to view provider-specific content
 */
export default function ProvidersPage() {
    const [language, setLanguage] = useState("en");
    const { data: partnersData, loading, error } = useOTTPartners({ limit: 100 });

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    /**
     * Transform partner data for display
     * Extracts provider information from API response
     * @param {Object} data - API response data
     * @returns {Array} Formatted provider items
     */
    const extractProviders = (data) => {
        if (!data) return [];
        
        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.items && Array.isArray(data.items)) return data.items;
        if (data.data && Array.isArray(data.data)) return data.data;
        if (data.widgets && Array.isArray(data.widgets)) {
            return data.widgets.flatMap(w => w.items || []);
        }
        
        return [];
    };

    const providers = extractProviders(partnersData);

    const translations = {
        en: {
            title: "OTT Providers",
            subtitle: "Browse content from all your favorite streaming platforms",
            loading: "Loading providers...",
            error: "Failed to load providers",
            noProviders: "No providers available",
            viewContent: "View Content",
        },
        ar: {
            title: "منصات OTT",
            subtitle: "تصفح المحتوى من جميع منصات البث المفضلة لديك",
            loading: "جاري تحميل المنصات...",
            error: "فشل تحميل المنصات",
            noProviders: "لا توجد منصات متاحة",
            viewContent: "عرض المحتوى",
        },
    };

    const t = translations[language];

    return (
        <main className="min-h-screen bg-[#0f0f1e]">
            {/* Header Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-b border-[#2d2d44]">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e5ff] mb-4">
                        {t.title}
                    </h1>
                    <p className="text-lg text-[#9ca3af]">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            {/* Providers Grid Section */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-48 rounded-lg" />
                        ))}
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="text-center py-12">
                        <p className="text-red-500 text-lg">{t.error}</p>
                        <p className="text-[#9ca3af] mt-2">{error}</p>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && providers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#9ca3af] text-lg">{t.noProviders}</p>
                    </div>
                )}

                {/* Providers Grid */}
                {!loading && providers.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {providers.map((provider) => (
                            <Card
                                key={provider.id || provider.ottplay_id}
                                className="bg-[#1a1a2e] border-[#2d2d44] hover:border-[#ec4899] transition-all cursor-pointer group overflow-hidden"
                            >
                                {/* Provider Logo/Image */}
                                {(provider.image_url || provider.posterUrl || provider.logo) && (
                                    <div className="relative h-40 bg-[#0f0f1e] overflow-hidden">
                                        <img
                                            src={provider.image_url || provider.posterUrl || provider.logo}
                                            alt={provider.name || provider.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                )}

                                {/* Provider Info */}
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-[#e5e5ff] mb-2 line-clamp-2">
                                        {provider.name || provider.title}
                                    </h3>
                                    
                                    {provider.description && (
                                        <p className="text-sm text-[#9ca3af] mb-4 line-clamp-2">
                                            {provider.description}
                                        </p>
                                    )}

                                    {/* View Content Button */}
                                    <button className="w-full px-4 py-2 rounded-lg bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-semibold hover:shadow-lg hover:shadow-[#ec4899]/50 transition-all">
                                        {t.viewContent}
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
