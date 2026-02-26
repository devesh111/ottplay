"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
    BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Skeleton from "@/components/ui/skeleton";
import {
    fetchCarouselItems,
    fetchProviderCarouselItems,
} from "@/lib/api/ottplay";

const PAGE_LIMIT = 20;

// ─── helpers ─────────────────────────────────────────────────────────────────

function getItemImage(item) {
    if (item.provider) return item.provider.logo_url || null;
    const img =
        item.movie?.posters?.[0] ||
        item.show?.posters?.[0] ||
        item.sport?.posters?.[0] ||
        null;
    return img ? img.split("?")[0] : img;
}

function getItemTitle(item) {
    if (item.provider) return item.provider.name || "Provider";
    return item.movie?.name || item.show?.name || item.sport?.name || "Content";
}

function getItemLink(item) {
    if (item.provider) return "/ott-platform/" + (item.provider.seourl || "");
    if ("movie" in item) return "/movie/" + item.movie?.seo_url;
    if ("show" in item) return "/show/" + item.show?.seo_url;
    if ("sport" in item)
        return "/sports/" + item.sport?.format + "/" + item.sport?.seo_url;
    return "#";
}

function getAspectRatio(templateName) {
    return templateName === "providers" ? "199/112" : "2/3";
}

function CardSkeleton({ aspectRatio = "2/3" }) {
    return (
        <div className="flex flex-col gap-3">
            <Skeleton className="w-full rounded-lg" style={{ aspectRatio }} />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
    );
}

// ─── main content ─────────────────────────────────────────────────────────────

function SeeAllContent() {
    const searchParams = useSearchParams();

    // Rebuild widget params from the URL (set by LazyHomeWidget / LazyProviderWidget)
    const widgetParams = Object.fromEntries(
        [
            "module_name",
            "platform",
            "section",
            "title",
            "pin_it",
            "template_name",
            "provider_id",
            "ottplay_id",
        ]
            .filter((k) => searchParams.get(k) !== null)
            .map((k) => [k, searchParams.get(k)]),
    );

    const source = searchParams.get("source") || "home";
    const pageTitle = searchParams.get("title") || "See All";
    const templateName = searchParams.get("template_name") || "";

    const [items, setItems] = useState([]);
    const [nextPage, setNextPage] = useState(null); // from API response
    const [lastPage, setLastPage] = useState(null); // from API response
    const [totalDocs, setTotalDocs] = useState(null); // from API response
    const [initialLoading, setInitialLoading] = useState(true);
    const [fetchingMore, setFetchingMore] = useState(false);
    const [error, setError] = useState(null);

    const sentinelRef = useRef(null);
    const isFetchingRef = useRef(false);

    // hasMore is true only when the API says there is a next page
    const hasMore = nextPage !== null && nextPage !== undefined;

    const fetchPage = useCallback(
        async (page, isInitial = false) => {
            if (isFetchingRef.current) return;
            isFetchingRef.current = true;

            try {
                isInitial ? setInitialLoading(true) : setFetchingMore(true);
                setError(null);

                const params = { ...widgetParams, limit: PAGE_LIMIT, page };

                const res =
                    source === "provider"
                        ? await fetchProviderCarouselItems(params)
                        : await fetchCarouselItems(params);

                const newItems = res?.rank ?? [];

                setItems((prev) =>
                    isInitial ? newItems : [...prev, ...newItems],
                );

                // Use the pagination keys the API returns directly
                setNextPage(res?.nextPage ?? null);
                setLastPage(res?.lastPage ?? null);
                setTotalDocs(res?.totalDocuments ?? null);
            } catch {
                setError("Failed to load items. Please try again.");
            } finally {
                isInitial ? setInitialLoading(false) : setFetchingMore(false);
                isFetchingRef.current = false;
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [source, JSON.stringify(widgetParams)],
    );

    // Initial load — page 1
    useEffect(() => {
        fetchPage(1, true);
    }, [fetchPage]);

    // IntersectionObserver — fires when the sentinel div scrolls into view
    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !isFetchingRef.current
                ) {
                    fetchPage(nextPage);
                }
            },
            { rootMargin: "200px" },
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, nextPage, fetchPage]);

    const aspectRatio = getAspectRatio(templateName);
    const gridCols =
        templateName === "providers"
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5";

    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb + header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {source === "provider" && (
                            <>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={`/ott-platform/${searchParams.get("provider_path") || ""}`}
                                    >
                                        {searchParams.get("provider_name") ||
                                            "Provider"}
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                            </>
                        )}
                        <BreadcrumbItem>
                            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>

                <div className="flex items-center justify-between mt-6">
                    <h1 className="text-3xl font-bold text-white">
                        {pageTitle}
                    </h1>
                    {!initialLoading && totalDocs !== null && (
                        <p className="text-sm text-muted-foreground">
                            Showing{" "}
                            <span className="font-semibold text-foreground">
                                {items.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-foreground">
                                {totalDocs}
                            </span>
                        </p>
                    )}
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-16">
                {error && (
                    <div className="text-center py-12">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={() => fetchPage(nextPage ?? 1)}
                            variant="outline"
                        >
                            Retry
                        </Button>
                    </div>
                )}

                <div className={`grid ${gridCols} gap-4`}>
                    {/* Loaded items */}
                    {items.map((item, index) => {
                        const imageUrl = getItemImage(item);
                        const title = getItemTitle(item);
                        const href = getItemLink(item);

                        return (
                            <Card
                                key={item.order ?? `item-${index}`}
                                className="overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group m-0 p-0"
                            >
                                <Link href={href}>
                                    <div
                                        className="relative w-full"
                                        style={{ aspectRatio }}
                                    >
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                alt={title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading={
                                                    index < 10
                                                        ? "eager"
                                                        : "lazy"
                                                }
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-linear-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                                                <span className="text-gray-400 text-center px-2 text-sm">
                                                    {title}
                                                </span>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                                            <h3 className="text-white font-bold text-sm line-clamp-2">
                                                {title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </Card>
                        );
                    })}

                    {/* Skeletons during initial load */}
                    {initialLoading &&
                        [...Array(PAGE_LIMIT)].map((_, i) => (
                            <CardSkeleton
                                key={`sk-${i}`}
                                aspectRatio={aspectRatio}
                            />
                        ))}

                    {/* Skeletons while fetching next page */}
                    {fetchingMore &&
                        [...Array(6)].map((_, i) => (
                            <CardSkeleton
                                key={`more-${i}`}
                                aspectRatio={aspectRatio}
                            />
                        ))}
                </div>

                {/* Sentinel — only rendered when the API says there is a next page */}
                {!initialLoading && hasMore && (
                    <div
                        ref={sentinelRef}
                        className="h-1 w-full mt-8"
                        aria-hidden
                    />
                )}

                {/* Spinner while fetching more */}
                {fetchingMore && (
                    <div className="flex justify-center items-center py-6 gap-2 text-muted-foreground text-sm">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Loading more…
                    </div>
                )}

                {/* End-of-list message — shown when API returns no nextPage */}
                {!initialLoading && !hasMore && items.length > 0 && (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground text-sm">
                            You&apos;ve reached the end — all {items.length}{" "}
                            items loaded.
                        </p>
                    </div>
                )}

                {/* Empty state */}
                {!initialLoading && !error && items.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No items found.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

// ─── exported page — Suspense required for useSearchParams ────────────────────

export default function SubsSeeAllPage() {
    return (
        <Suspense
            fallback={
                <main className="min-h-screen bg-background flex items-center justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </main>
            }
        >
            <SeeAllContent />
        </Suspense>
    );
}
