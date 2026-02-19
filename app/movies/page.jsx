"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { fetMoviesList } from "@/lib/api/ottplay";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const MovieListingPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [results, setResults] = useState([]);

    useEffect(() => {
        const loadMovies = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetMoviesList({
                    limit: 100,
                    page: 1,
                    release_status: "released",
                    languageFallback: "primary",
                });

                console.log(response);

                const transformedResults = (response.movies || []).map(
                    (item) => ({
                        id: item._id || item.ottplay_id || item.name,
                        title: item.name || item.title || "",
                        type: item.content_type || "content",
                        image:
                            item.imageurl ||
                            item.posters?.[0] ||
                            item.backdrops?.[0]?.url ||
                            "",
                        url: item.seo_url,
                    }),
                );
                const filteredResults = transformedResults.reduce((r, o) => {
                    if (!r.some((obj) => obj.title === o.title)) {
                        r.push(o);
                    }
                    return r;
                }, []);
                setResults(filteredResults);
            } catch (err) {
                console.error("Failed to load movies list:", err);
                setError("Failed to load movies list");
            } finally {
                setLoading(false);
            }
        };

        loadMovies();
    }, []);

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
                            <BreadcrumbLink href="/movies">
                                Movies
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            {loading && (
                <div className="min-h-screen flex items-center justify-center">
                    <p className="text-white">Loading...</p>
                </div>
            )}
            {!loading && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                        {results && (
                            <>
                                {results.map((result) => (
                                    <Card
                                        key={result.id}
                                        className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group py-0 gap-0"
                                    >
                                        {/* Result Image */}
                                        {result.url && (
                                            <Link href={`movie/${result.url}`}>
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
                                                    <Link
                                                        href={`movie/${result.url}`}
                                                    >
                                                        View Details
                                                    </Link>
                                                )}
                                            </Button>
                                        </div>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>
                </section>
            )}
        </main>
    );
};

export default MovieListingPage;
