"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    fetchSearchAllContent,
    fetchSearchMovieContent,
    fetchSearchShowContent,
} from "@/lib/api/ottplay";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Skeleton from "@/components/ui/skeleton";

const LIMIT = 20;

const TABS = [
    { label: "All", type: "all", fetchFn: fetchSearchAllContent },
    { label: "Movie", type: "movie", fetchFn: fetchSearchMovieContent },
    { label: "Show", type: "show", fetchFn: fetchSearchShowContent },
];

function getItemLink(item) {
    if (item.content_type === "movie") return "/movie/" + item.seo_url;
    if (item.content_type === "show") return "/show/" + item.seo_url;
    if (item.content_type === "sport") return "/sports/" + item.format + "/" + item.seo_url;
    return "#";
}

function transformResults(items = []) {
    return items.map((item) => ({
        id: item._id || item.ottplay_id || item.name,
        title: item.name || item.title || "",
        type: item.content_type || "content",
        image: item.imageurl || item.posters?.[0] || item.backdrops?.[0]?.url || "",
        url: getItemLink(item),
    }));
}

function CardSkeleton() {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="h-64 w-full rounded-lg" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-8 w-full rounded-md" />
        </div>
    );
}

export default function SearchClient({ query, initialItems, initialNextPage, initialTotalDocs }) {
    // "all" tab is pre-loaded by SSR; switching tabs triggers client fetches
    const [activeTab, setActiveTab] = useState("all");
    const [items, setItems] = useState(initialItems);
    const [nextPage, setNextPage] = useState(initialNextPage);
    const [totalDocs, setTotalDocs] = useState(initialTotalDocs);
    const [initialLoading, setInitialLoading] = useState(false);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    const sentinelRef = useRef(null);
    const isFetchingRef = useRef(false);

    const currentTab = TABS.find((t) => t.type === activeTab);

    const fetchPage = useCallback(
        async (pageNum, isInitial = false, tabType = activeTab) => {
            if (!query.trim()) return;
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            const tab = TABS.find((t) => t.type === tabType);
            if (!tab) return;

            try {
                isInitial ? setInitialLoading(true) : setFetchingMore(true);
                setError(null);

                const response = await tab.fetchFn({ query, limit: LIMIT, type: tabType, page: pageNum });
                const transformed = transformResults(response.result || []);

                setItems((prev) => (isInitial ? transformed : [...prev, ...transformed]));
                setNextPage(response.nextPage ?? null);
                setTotalDocs(response.totalDocuments ?? null);
            } catch {
                setError("Failed to fetch search results. Please try again.");
            } finally {
                isInitial ? setInitialLoading(false) : setFetchingMore(false);
                isFetchingRef.current = false;
            }
        },
        [query, activeTab]
    );

    // Only re-fetch when tab changes (SSR already loaded the "all" tab initial data)
    useEffect(() => {
        if (activeTab === "all") {
            // Restore the SSR-provided data
            setItems(initialItems);
            setNextPage(initialNextPage);
            setTotalDocs(initialTotalDocs);
            return;
        }
        setItems([]);
        setNextPage(null);
        setTotalDocs(null);
        isFetchingRef.current = false;
        if (query.trim()) fetchPage(1, true, activeTab);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTab]);

    // IntersectionObserver for infinite scroll
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && nextPage && !isFetchingRef.current) {
                    fetchPage(nextPage, false, activeTab);
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextPage, fetchPage, activeTab]);

    const hasMore = !!nextPage;
    const totalLoaded = items.length;
    const showResults = !initialLoading && !error && items.length > 0;
    const showEmpty = !initialLoading && !error && !!query && items.length === 0;

    return (
        <div className="min-h-screen bg-background">
            {/* Sticky header with filter tabs */}
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

                    <div className="flex gap-2">
                        {TABS.map((tab) => (
                            <Button
                                key={tab.type}
                                onClick={() => setActiveTab(tab.type)}
                                className="text-white hover:text-white"
                                variant={activeTab === tab.type ? "default" : "outline"}
                            >
                                {tab.label}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {query && (
                    <p className="text-muted-foreground mb-6">
                        Results for: <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
                        {totalDocs !== null && !initialLoading && (
                            <span className="ml-2 text-sm">
                                — showing{" "}
                                <span className="font-semibold text-foreground">{totalLoaded}</span> of{" "}
                                <span className="font-semibold text-foreground">{totalDocs}</span>{" "}
                                {currentTab?.label.toLowerCase()}s
                            </span>
                        )}
                    </p>
                )}

                {error && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-destructive mb-6">
                        {error}
                    </div>
                )}

                {showEmpty && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">No results found for &quot;{query}&quot;</p>
                        <p className="text-muted-foreground text-sm mt-2">Try searching with different keywords</p>
                    </div>
                )}

                {!initialLoading && !query && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-lg">Enter a search term above to find movies, shows, and sports.</p>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                    {showResults && items.map((result) => (
                        <Card key={result.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0">
                            <Link href={result.url}>
                                {result.image ? (
                                    <div className="relative overflow-hidden bg-muted h-64">
                                        <img src={result.image} alt={result.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
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

                    {initialLoading && [...Array(LIMIT)].map((_, i) => <CardSkeleton key={`sk-init-${i}`} />)}
                    {fetchingMore && [...Array(5)].map((_, i) => <CardSkeleton key={`sk-more-${i}`} />)}
                </div>

                {!initialLoading && hasMore && <div ref={sentinelRef} className="h-1 w-full mt-8" aria-hidden />}

                {fetchingMore && (
                    <div className="flex justify-center items-center py-6 gap-2 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more results…
                    </div>
                )}

                {!initialLoading && !hasMore && totalLoaded > 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">You&apos;ve reached the end — all {totalLoaded} results loaded.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
