"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { searchApi } from "@/lib/api/client";
import { MovieCard } from "@/components/content/MovieCard";
import { ShowCard } from "@/components/content/ShowCard";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!query) return;

        const performSearch = async () => {
            try {
                setLoading(true);
                const res = await searchApi.search(query);
                setResults(res.data);
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setLoading(false);
            }
        };

        performSearch();
    }, [query]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">
                Search Results for "{query}"
            </h1>

            {loading ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">Searching...</p>
                </div>
            ) : !results ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No results found</p>
                </div>
            ) : (
                <div className="space-y-12">
                    {results.movies && results.movies.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Movies</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {results.movies.map((movie) => (
                                    <MovieCard key={movie.id} movie={movie} />
                                ))}
                            </div>
                        </section>
                    )}

                    {results.shows && results.shows.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Shows</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {results.shows.map((show) => (
                                    <ShowCard key={show.id} show={show} />
                                ))}
                            </div>
                        </section>
                    )}

                    {results.articles && results.articles.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4">
                                Articles
                            </h2>
                            <div className="space-y-4">
                                {results.articles.map((article) => (
                                    <div
                                        key={article.id}
                                        className="border rounded-lg p-4"
                                    >
                                        <h3 className="font-semibold">
                                            {article.title}
                                        </h3>
                                        <p className="text-gray-600 text-sm mt-2">
                                            {article.excerpt}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}
