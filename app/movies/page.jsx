"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetMoviesList } from "@/lib/api/ottplay";
import Link from "next/link";
import Skeleton from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

const LIMIT = 20;

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

function transformMovies(movies = []) {
    return movies.map((item) => ({
        id: item._id || item.ottplay_id || item.name,
        title: item.name || item.title || "",
        type: item.content_type || "movie",
        image:
            item.imageurl ||
            item.posters?.[0] ||
            item.backdrops?.[0]?.url ||
            "",
        url: item.seo_url,
    }));
}

export default function MovieListingPage() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalDocs, setTotalDocs] = useState(null);
    const [nextPage, setNextPage] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    // Sentinel ref for IntersectionObserver
    const sentinelRef = useRef(null);

    // Prevent duplicate fetches
    const isFetchingRef = useRef(false);

    const fetchPage = useCallback(async (pageNum, isInitial = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            isInitial ? setInitialLoading(true) : setFetchingMore(true);
            setError(null);

            const response = await fetMoviesList({
                limit: LIMIT,
                page: pageNum,
                release_status: "released",
                languageFallback: "primary",
            });

            const transformed = transformMovies(response.movies || []);
            setItems((prev) =>
                isInitial ? transformed : [...prev, ...transformed],
            );
            setNextPage(response.nextPage ?? null);
            setTotalDocs(response.totalDocuments ?? null);
            setPage(pageNum);
        } catch {
            setError("Failed to load movies. Please try again.");
        } finally {
            isInitial ? setInitialLoading(false) : setFetchingMore(false);
            isFetchingRef.current = false;
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchPage(1, true);
    }, [fetchPage]);

    // IntersectionObserver — triggers when sentinel scrolls into view
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    nextPage &&
                    !isFetchingRef.current
                ) {
                    fetchPage(nextPage);
                }
            },
            { rootMargin: "200px" }, // start loading 200px before user hits the bottom
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextPage, fetchPage]);

    const hasMore = !!nextPage;
    const totalLoaded = items.length;

    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/movies">
                                Movies
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                {/* Stats bar */}
                {!initialLoading && totalDocs !== null && (
                    <p className="text-sm text-muted-foreground mt-4">
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {totalLoaded}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">
                            {totalDocs}
                        </span>{" "}
                        movies
                    </p>
                )}
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={() => fetchPage(1, true)}
                            variant="outline"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                    {/* Loaded items */}
                    {items.map((result) => (
                        <Card
                            key={result.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0"
                        >
                            {result.url && (
                                <Link href={`movie/${result.url}`}>
                                    {result.image ? (
                                        <div className="relative overflow-hidden bg-muted h-64">
                                            <img
                                                src={result.image}
                                                alt={result.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
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
                            <div className="p-4">
                                <h3 className="font-semibold text-sm line-clamp-2 mb-2">
                                    {result.title}
                                </h3>
                                <div className="mb-3">
                                    <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded capitalize">
                                        {result.type}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full text-xs dark:border dark:border-accent dark:text-accent dark:hover:text-white dark:hover:bg-primary"
                                    asChild
                                >
                                    <Link href={`movie/${result.url}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {/* Initial skeleton — 20 placeholders */}
                    {initialLoading &&
                        [...Array(LIMIT)].map((_, i) => (
                            <CardSkeleton key={`sk-${i}`} />
                        ))}

                    {/* "Load more" skeleton — 5 placeholders while fetching next page */}
                    {fetchingMore &&
                        [...Array(5)].map((_, i) => (
                            <CardSkeleton key={`more-${i}`} />
                        ))}
                </div>

                {/* Invisible sentinel div — triggers next page fetch when scrolled into view */}
                {!initialLoading && hasMore && (
                    <div
                        ref={sentinelRef}
                        className="h-1 w-full mt-8"
                        aria-hidden
                    />
                )}

                {/* End-of-list message */}
                {!initialLoading && !hasMore && items.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">
                            You've reached the end — all {totalLoaded} movies
                            loaded.
                        </p>
                    </div>
                )}

                {/* Spinner shown while fetching (fallback for slow connections) */}
                {fetchingMore && (
                    <div className="flex justify-center items-center py-6 gap-2 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more movies…
                    </div>
                )}
            </section>
        </main>
    );
}
