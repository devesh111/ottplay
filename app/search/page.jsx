"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SearchAutocomplete } from "@/components/home/SearchAutoComplete";
import { fetchSearchContent } from "@/lib/api/ottplay";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getItemLink = (item) => {
        if (item.content_type === "movie") return "/movie/" + item.seo_url;
        if (item.content_type === "show") return "/show/" + item.seo_url;
        if (item.content_type === "sport")
            return "/sports/" + item.format + "/" + item.seo_url;
        return "#";
    };
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const fetchResults = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetchSearchContent({
                    query: query,
                });
                const transformedResults = (response.result || []).map(
                    (item) => ({
                        id: item._id || item.ottplay_id || item.name,
                        title: item.name || item.title || "",
                        type: item.content_type || "content",
                        image:
                            item.imageurl ||
                            item.posters?.[0] ||
                            item.backdrops?.[0]?.url ||
                            "",
                        url: getItemLink(item),
                    }),
                );

                setResults(transformedResults);
            } catch (err) {
                console.error("Error fetching search results:", err);
                setError("Failed to fetch search results. Please try again.");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResults();
    }, [query]);

    return (
        <div className="min-h-screen bg-background">
            {/* Header with back button and search box */}
            <div className="border-b sticky top-0 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 z-40">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold">Search Results</h1>
                    </div>

                    {/* Search box on results page */}
                    <SearchAutocomplete />
                </div>
            </div>

            {/* Main content area */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Query display */}
                {query && (
                    <div className="mb-6">
                        <p className="text-muted-foreground">
                            Results for:{" "}
                            <span className="font-semibold text-foreground">
                                "{query}"
                            </span>
                        </p>
                    </div>
                )}

                {/* Loading state */}
                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">
                            Loading results...
                        </p>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
                        {error}
                    </div>
                )}

                {/* No results state */}
                {!isLoading && !error && results.length === 0 && query && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">
                            No results found for "{query}"
                        </p>
                        <p className="text-muted-foreground text-sm mt-2">
                            Try searching with different keywords
                        </p>
                    </div>
                )}

                {/* Results Grid - Responsive layout (1-4 columns) */}
                {!isLoading && !error && results.length > 0 && (
                    <>
                        <p className="text-sm text-muted-foreground mb-6">
                            Found {results.length} result
                            {results.length !== 1 ? "s" : ""}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                            {results.map((result) => (
                                <Card
                                    key={result.id}
                                    className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0"
                                >
                                    {/* Result Image */}
                                    {result.url && (
                                        <Link href={result.url}>
                                            {result.image ? (
                                                <div className="relative overflow-hidden bg-muted h-64">
                                                    <img
                                                        src={result.image}
                                                        alt={result.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        onError={(e) => {
                                                            // Hide image if it fails to load
                                                            e.target.style.display =
                                                                "none";
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-64 bg-muted flex items-center justify-center">
                                                    <p className="text-muted-foreground text-sm">
                                                        No image
                                                    </p>
                                                </div>
                                            )}
                                        </Link>
                                    )}

                                    {/* Result Info */}
                                    <div className="p-4">
                                        {/* Title */}
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                                            {result.title}
                                        </h3>

                                        {/* Type Badge */}
                                        {result.type && (
                                            <div className="mb-3">
                                                <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded capitalize">
                                                    {result.type}
                                                </span>
                                            </div>
                                        )}

                                        {/* View Details Button */}
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs dark:border dark:border-accent dark:text-accent dark:hover:text-white dark:hover:bg-primary"
                                        >
                                            {result.url && (
                                                <Link href={result.url}>
                                                    View Details
                                                </Link>
                                            )}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const Page = () => {
    return (
        <Suspense>
            <SearchPage />
        </Suspense>
    );
};

export default Page;
