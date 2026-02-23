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
import { fetchShowsList } from "@/lib/api/ottplay";
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

function transformShows(shows = []) {
    return shows.map((item) => ({
        id: item._id || item.ottplay_id || item.name,
        title: item.name || item.title || "",
        type: item.content_type || "show",
        image:
            item.imageurl ||
            item.posters?.[0] ||
            item.backdrops?.[0]?.url ||
            "",
        url: item.seo_url,
    }));
}

export default function ShowListingPage() {
    const [items, setItems] = useState([]);
    const [nextPage, setNextPage] = useState(null);
    const [totalDocs, setTotalDocs] = useState(null);
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    const sentinelRef = useRef(null);
    const isFetchingRef = useRef(false);

    const fetchPage = useCallback(async (pageNum, isInitial = false) => {
        if (isFetchingRef.current) return;
        isFetchingRef.current = true;

        try {
            isInitial ? setInitialLoading(true) : setFetchingMore(true);
            setError(null);

            const response = await fetchShowsList({
                limit: LIMIT,
                page: pageNum,
                release_status: "released",
                languageFallback: "primary",
            });

            const transformed = transformShows(response.shows || []);
            setItems((prev) =>
                isInitial ? transformed : [...prev, ...transformed],
            );
            setNextPage(response.nextPage ?? null);
            setTotalDocs(response.totalDocuments ?? null);
        } catch {
            setError("Failed to load shows. Please try again.");
        } finally {
            isInitial ? setInitialLoading(false) : setFetchingMore(false);
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        fetchPage(1, true);
    }, [fetchPage]);

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
            { rootMargin: "200px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [nextPage, fetchPage]);

    const totalLoaded = items.length;
    const hasMore = !!nextPage;

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/shows">Shows</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

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
                        shows
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
                    {items.map((result) => (
                        <Card
                            key={result.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0"
                        >
                            {result.url && (
                                <Link href={`show/${result.url}`}>
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
                                    <Link href={`show/${result.url}`}>
                                        View Details
                                    </Link>
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {initialLoading &&
                        [...Array(LIMIT)].map((_, i) => (
                            <CardSkeleton key={`sk-${i}`} />
                        ))}
                    {fetchingMore &&
                        [...Array(5)].map((_, i) => (
                            <CardSkeleton key={`more-${i}`} />
                        ))}
                </div>

                {!initialLoading && hasMore && (
                    <div
                        ref={sentinelRef}
                        className="h-1 w-full mt-8"
                        aria-hidden
                    />
                )}

                {!initialLoading && !hasMore && items.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">
                            You've reached the end — all {totalLoaded} shows
                            loaded.
                        </p>
                    </div>
                )}

                {fetchingMore && (
                    <div className="flex justify-center items-center py-6 gap-2 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more shows…
                    </div>
                )}
            </section>
        </main>
    );
}
