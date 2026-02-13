"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ChevronDown, ChevronLeftSquare, Play } from "lucide-react";
import { fetchEpisodes } from "@/lib/api/ottplay";

export default function Episodes({ seasonNumber, seoUrl }) {
    const [allEpisodes, setAllEpisodes] = useState([]);
    const [displayedEpisodes, setDisplayedEpisodes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [paginationData, setPaginationData] = useState(null);
    const [nextPageToFetch, setNextPageToFetch] = useState(2);
    const [totalDocuments, setTotalDocuments] = useState(0);

    const fetchData = async (page) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetchEpisodes({
                seoUrl: seoUrl,
                limit: 5,
                seasonNumber: seasonNumber,
                custom: true,
                sortBy: "desc",
                error_version: 2,
                page: page,
            });

            setPaginationData(response);
            setTotalDocuments(response.totalDocuments);
            const newAllEpisodes = [...allEpisodes, ...response.episodes];
            setAllEpisodes(newAllEpisodes);

            setDisplayedEpisodes(newAllEpisodes);
            if (response.nextPage) {
                setNextPageToFetch(response.nextPage);
            }
            if (!response.nextPage) {
                setNextPageToFetch(null);
            }

            setCurrentPage(page);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Failed to load episodes details",
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetchEpisodes({
                    seoUrl: seoUrl,
                    limit: 5,
                    seasonNumber: seasonNumber,
                    custom: true,
                    sortBy: "desc",
                    error_version: 2,
                    page: 1,
                });

                setPaginationData(response);
                setTotalDocuments(response.totalDocuments);

                setAllEpisodes(response.episodes);
                setDisplayedEpisodes(response.episodes);
                setCurrentPage(response.currentPage);

                if (response.nextPage) {
                    setNextPageToFetch(response.nextPage);
                }
                if (!response.nextPage) {
                    setNextPageToFetch(null);
                }
            } catch (error) {
                console.log(error);
                setError(
                    error.response?.data?.message ||
                        "Failed to load episodes details",
                );
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, [seasonNumber]);

    const handleLoadMore = async () => {
        await fetchData(nextPageToFetch);
    };

    const handleLoadLess = async () => {
        // Show only first 10 episodes
        // setDisplayedEpisodes(allEpisodes.slice(0, 5));
        setDisplayedEpisodes([]);
        // Reset to page 1 so "Load More" can fetch page 2 again
        setCurrentPage(1);
        setNextPageToFetch(2);
        // await fetchData(1);
    };

    const hasMorePages = nextPageToFetch;

    const canLoadMore = hasMorePages;
    // const canLoadLess = !hasMorePages;

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto mt-10">
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 font-medium">
                            Error: {error}
                        </p>
                    </div>
                )}

                <div className="flex flex-col gap-6 mb-8">
                    {displayedEpisodes.map((episode, index) => (
                        <Card
                            key={episode._id}
                            className="py-1 pl-3 pr-5 hover:shadow-lg transition-shadow duration-200 bg-episode-card overflow-hidden rounded-sm"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between  gap-3">
                                <div className="flex items-center gap-4">
                                    <div className="flex-none">
                                        <img
                                            src={episode.backdrop_url}
                                            className="w-45 h-25.25 rounded-sm"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-4 mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-sm md:text-md font-semibold line-clamp-2 text-white">
                                                {episode.name}
                                            </h3>
                                            <p className="text-sm mt-1">
                                                Episode #
                                                {episode.episode_number} •{" "}
                                                <span className="">
                                                    {new Date(
                                                        episode.air_date,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                        },
                                                    )}
                                                </span>
                                            </p>
                                        </div>
                                        {episode.run_time && (
                                            <div className="text-sm">
                                                <span className="font-medium">
                                                    Duration: {episode.run_time}{" "}
                                                    mins
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

                <div className="flex justify-center gap-4">
                    {canLoadMore && (
                        <Button
                            onClick={handleLoadMore}
                            variant="outline"
                            disabled={isLoading}
                            size="lg"
                            className="dark:border-primary text-primary hover:text-white px-8"
                        >
                            {isLoading ? "Loading..." : (<>Show More <ChevronDown /></>)} 
                        </Button>
                    )}

                    {/* {canLoadLess && (
                        <Button
                            onClick={handleLoadLess}
                            disabled={isLoading}
                            size="lg"
                            variant="outline"
                            className="px-8"
                        >
                            Load Less
                        </Button>
                    )} */}
                </div>
            </div>
        </div>
    );
}
