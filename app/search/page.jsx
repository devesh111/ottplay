"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchSearchContent } from "@/lib/api/ottplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SearchAutocomplete } from "@/components/home/SearchAutoComplete";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

function getItemLink(item) {
    if (item.content_type === "movie") return "/movie/" + item.seo_url;
    if (item.content_type === "show") return "/show/" + item.seo_url;
    if (item.content_type === "sport") return "/sports/" + item.format + "/" + item.seo_url;
    return "#";
}

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") ?? "";

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetchSearchContent({ query });
                setResults(
                    (response.result || []).map((item) => ({
                        id: item._id || item.ottplay_id || item.name,
                        title: item.name || item.title || "",
                        type: item.content_type || "content",
                        image: item.imageurl || item.posters?.[0] || item.backdrops?.[0]?.url || "",
                        url: getItemLink(item),
                    }))
                );
            } catch {
                setError("Failed to fetch search results. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [query]);

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky header */}
            <div className="border-b sticky top-0 bg-background/95 backdrop-blur z-40">
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
                    <SearchAutocomplete />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Query label */}
                {query && (
                    <p className="text-muted-foreground mb-6">
                        Results for: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
                    </p>
                )}

                {/* Loading */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <div className="h-64 w-full rounded-lg bg-[#292038] animate-pulse" />
                                <div className="h-4 w-3/4 rounded bg-[#292038] animate-pulse" />
                                <div className="h-8 w-full rounded bg-[#292038] animate-pulse" />
                            </div>
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && query && results.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No results found for &quot;{query}&quot;</p>
                        <p className="text-muted-foreground text-sm mt-2">Try searching with different keywords</p>
                    </div>
                )}

                {/* No query yet */}
                {!loading && !query && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">Enter a search term above to find movies, shows, and sports.</p>
                    </div>
                )}

                {/* Results */}
                {!loading && !error && results.length > 0 && (
                    <>
                        <p className="text-sm text-muted-foreground mb-6">
                            Found {results.length} result{results.length !== 1 ? "s" : ""}
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                            {results.map((result) => (
                                <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0">
                                    <Link href={result.url}>
                                        {result.image ? (
                                            <div className="relative overflow-hidden bg-muted h-64">
                                                <img src={result.image} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                            </div>
                                        ) : (
                                            <div className="w-full h-64 bg-muted flex items-center justify-center">
                                                <p className="text-muted-foreground text-sm">No image</p>
                                            </div>
                                        )}
                                    </Link>
                                    <div className="p-4">
                                        <h3 className="font-semibold text-sm line-clamp-2 mb-2">{result.title}</h3>
                                        {result.type && (
                                            <div className="mb-3">
                                                <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded capitalize">{result.type}</span>
                                            </div>
                                        )}
                                        <Button variant="outline" className="w-full text-xs dark:border dark:border-accent dark:text-accent dark:hover:text-white dark:hover:bg-primary" asChild>
                                            <Link href={result.url}>View Details</Link>
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
}
