"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchAutocomplete } from "@/hooks/useOTTplay";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/layout/Footer";
import { Search as SearchIcon } from "lucide-react";

/**
 * Search Page Component
 * Provides search functionality with autocomplete suggestions
 * Fetches suggestions from OTTplay Search Autocomplete API
 * 
 * Features:
 * - Real-time search suggestions
 * - Debounced API calls for performance
 * - Support for movies, shows, actors, etc.
 * - Bilingual support (English/Arabic)
 * - Click to view details
 */
export default function SearchPage() {
    const [language, setLanguage] = useState("en");
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches, setRecentSearches] = useState([]);

    // Fetch search suggestions using custom hook
    const { data: suggestionsData, loading: suggestionsLoading } = useSearchAutocomplete(
        searchQuery,
        { limit: 12 }
    );

    // Load language preference and recent searches from localStorage
    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);

        const savedSearches = localStorage.getItem("recentSearches");
        if (savedSearches) {
            setRecentSearches(JSON.parse(savedSearches));
        }
    }, []);

    /**
     * Handle search input change
     * Updates search query which triggers API call via hook
     * @param {Event} e - Input change event
     */
    const handleSearchChange = useCallback((e) => {
        setSearchQuery(e.target.value);
    }, []);

    /**
     * Handle search submission
     * Saves search to recent searches and navigates to results
     * @param {string} query - Search query to submit
     */
    const handleSearchSubmit = useCallback((query) => {
        if (!query.trim()) return;

        // Add to recent searches
        const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 10);
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));

        // Navigate to results page (can be implemented later)
        // router.push(`/search/results?q=${encodeURIComponent(query)}`);
    }, [recentSearches]);

    /**
     * Extract suggestions from API response
     * Handles different response structures
     * @param {Object} data - API response data
     * @returns {Array} Formatted suggestions
     */
    const extractSuggestions = (data) => {
        if (!data) return [];

        // Handle different response structures
        if (Array.isArray(data)) return data;
        if (data.suggestions && Array.isArray(data.suggestions)) return data.suggestions;
        if (data.results && Array.isArray(data.results)) return data.results;
        if (data.data && Array.isArray(data.data)) return data.data;

        return [];
    };

    const suggestions = extractSuggestions(suggestionsData);

    const translations = {
        en: {
            title: "Search",
            subtitle: "Find movies, shows, actors, and more",
            searchPlaceholder: "Search for movies, shows, actors...",
            recentSearches: "Recent Searches",
            suggestions: "Suggestions",
            noResults: "No results found",
            clearRecent: "Clear Recent",
            viewDetails: "View Details",
            type: "Type",
            rating: "Rating",
        },
        ar: {
            title: "بحث",
            subtitle: "ابحث عن الأفلام والمسلسلات والممثلين والمزيد",
            searchPlaceholder: "ابحث عن الأفلام والمسلسلات والممثلين...",
            recentSearches: "عمليات البحث الأخيرة",
            suggestions: "الاقتراحات",
            noResults: "لم يتم العثور على نتائج",
            clearRecent: "مسح الأخيرة",
            viewDetails: "عرض التفاصيل",
            type: "النوع",
            rating: "التقييم",
        },
    };

    const t = translations[language];

    return (
        <main className="min-h-screen bg-[#0f0f1e]">
            {/* Header Section */}
            <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-b border-[#2d2d44]">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl font-bold text-[#e5e5ff] mb-4">
                        {t.title}
                    </h1>
                    <p className="text-lg text-[#9ca3af]">
                        {t.subtitle}
                    </p>
                </div>
            </section>

            {/* Search Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Search Input */}
                <div className="relative mb-8">
                    <div className="relative">
                        <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#9ca3af] w-5 h-5" />
                        <Input
                            type="text"
                            placeholder={t.searchPlaceholder}
                            value={searchQuery}
                            onChange={handleSearchChange}
                            onKeyPress={(e) => {
                                if (e.key === "Enter") {
                                    handleSearchSubmit(searchQuery);
                                }
                            }}
                            className="pl-12 pr-4 py-3 w-full bg-[#1a1a2e] border-[#2d2d44] text-[#e5e5ff] placeholder-[#6b7280] focus:border-[#ec4899] focus:ring-[#ec4899]"
                        />
                    </div>

                    {/* Suggestions Dropdown */}
                    {searchQuery && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a2e] border border-[#2d2d44] rounded-lg shadow-2xl z-50 max-h-96 overflow-y-auto">
                            {/* Loading State */}
                            {suggestionsLoading && (
                                <div className="p-4 space-y-3">
                                    {[...Array(3)].map((_, i) => (
                                        <Skeleton key={i} className="h-12 rounded" />
                                    ))}
                                </div>
                            )}

                            {/* Suggestions List */}
                            {!suggestionsLoading && suggestions.length > 0 && (
                                <div className="p-2">
                                    {suggestions.map((suggestion, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                setSearchQuery(suggestion.title || suggestion.name || "");
                                                handleSearchSubmit(suggestion.title || suggestion.name || "");
                                            }}
                                            className="p-3 hover:bg-[#2d2d44] cursor-pointer rounded transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Thumbnail */}
                                                {suggestion.image_url || suggestion.posterUrl && (
                                                    <img
                                                        src={suggestion.image_url || suggestion.posterUrl}
                                                        alt={suggestion.title || suggestion.name}
                                                        className="w-10 h-14 object-cover rounded"
                                                    />
                                                )}

                                                {/* Suggestion Info */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-[#e5e5ff] font-semibold truncate">
                                                        {suggestion.title || suggestion.name}
                                                    </p>
                                                    <div className="flex gap-2 mt-1 text-xs text-[#9ca3af]">
                                                        {suggestion.type && (
                                                            <span className="px-2 py-0.5 bg-[#0f0f1e] rounded">
                                                                {suggestion.type}
                                                            </span>
                                                        )}
                                                        {suggestion.rating && (
                                                            <span className="px-2 py-0.5 bg-[#0f0f1e] rounded">
                                                                ⭐ {suggestion.rating}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* No Results */}
                            {!suggestionsLoading && suggestions.length === 0 && searchQuery && (
                                <div className="p-4 text-center text-[#9ca3af]">
                                    {t.noResults}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Recent Searches Section */}
                {!searchQuery && recentSearches.length > 0 && (
                    <div className="mb-12">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-[#e5e5ff]">
                                {t.recentSearches}
                            </h2>
                            <button
                                onClick={() => {
                                    setRecentSearches([]);
                                    localStorage.removeItem("recentSearches");
                                }}
                                className="text-sm text-[#ec4899] hover:text-[#a855f7] transition-colors"
                            >
                                {t.clearRecent}
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {recentSearches.map((search, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        setSearchQuery(search);
                                        handleSearchSubmit(search);
                                    }}
                                    className="px-4 py-2 rounded-full bg-[#1a1a2e] border border-[#2d2d44] text-[#e5e5ff] hover:border-[#ec4899] hover:text-[#ec4899] transition-all"
                                >
                                    {search}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Popular Searches Section (when no query) */}
                {!searchQuery && recentSearches.length === 0 && (
                    <div className="text-center py-12">
                        <SearchIcon className="w-16 h-16 text-[#2d2d44] mx-auto mb-4" />
                        <p className="text-[#9ca3af] text-lg">
                            {language === "en"
                                ? "Start typing to search for movies, shows, and more"
                                : "ابدأ الكتابة للبحث عن الأفلام والمسلسلات والمزيد"}
                        </p>
                    </div>
                )}
            </section>

            {/* Footer */}
            <Footer />
        </main>
    );
}
