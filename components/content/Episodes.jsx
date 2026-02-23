"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, Play } from "lucide-react";
import { fetchEpisodes } from "@/lib/api/ottplay";

/**
 * Episodes — Client Component.
 * Accepts `initialEpisodes` pre-fetched by the Server Component for the first
 * page/season so there is no loading flash on first render.
 * Subsequent "load more" and season changes fetch via /api/episodes.
 */
export default function Episodes({ seasonNumber, seoUrl, initialEpisodes }) {
    const [allEpisodes, setAllEpisodes] = useState(
        initialEpisodes?.episodes ?? []
    );
    const [nextPageToFetch, setNextPageToFetch] = useState(
        initialEpisodes?.nextPage ?? null
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Re-fetch when season changes (initialEpisodes only covers the default season)
    useEffect(() => {
        // If initialEpisodes covers this season, use it directly on first render
        if (initialEpisodes && initialEpisodes.episodes) {
            setAllEpisodes(initialEpisodes.episodes);
            setNextPageToFetch(initialEpisodes.nextPage ?? null);
            return;
        }
        loadPage(1, true);
    }, [seasonNumber]); // eslint-disable-line react-hooks/exhaustive-deps

    async function loadPage(page, reset = false) {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchEpisodes({
                seoUrl,
                limit: 5,
                seasonNumber,
                custom: true,
                sortBy: "desc",
                error_version: 2,
                page,
            });
            setAllEpisodes((prev) =>
                reset ? response.episodes : [...prev, ...response.episodes]
            );
            setNextPageToFetch(response.nextPage ?? null);
        } catch (err) {
            setError("Failed to load episodes");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto mt-10">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">Error: {error}</p>
                    </div>
                )}

                <div className="flex flex-col gap-6 mb-8">
                    {allEpisodes.map((episode) => (
                        <Card
                            key={episode._id}
                            className="py-1 pl-3 pr-5 hover:shadow-lg transition-shadow duration-200 bg-episode-card overflow-hidden rounded-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex-none">
                                        <img
                                            src={episode.backdrop_url}
                                            className="w-45 h-25.25 rounded-sm"
                                            alt={episode.name}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-sm md:text-md font-semibold line-clamp-2 text-white">
                                                {episode.name}
                                            </h3>
                                            <p className="text-sm mt-1">
                                                Episode #{episode.episode_number} •{" "}
                                                <span>
                                                    {new Date(
                                                        episode.air_date
                                                    ).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </p>
                                        </div>
                                        {episode.run_time && (
                                            <div className="text-sm">
                                                <span className="font-medium">
                                                    Duration: {episode.run_time} mins
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-3 text-sm text-right">
                                    <Button className="text-white">
                                        <Play fill="white" />
                                        Play
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="flex flex-col items-center gap-4">
                            <Spinner className="w-8 h-8" />
                            <p className="text-slate-600 font-medium">
                                Loading episodes...
                            </p>
                        </div>
                    </div>
                )}

                {nextPageToFetch && (
                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => loadPage(nextPageToFetch)}
                            variant="outline"
                            disabled={isLoading}
                            size="lg"
                            className="dark:border-primary text-primary hover:text-white px-8"
                        >
                            {isLoading ? "Loading..." : <>Show More <ChevronDown /></>}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
