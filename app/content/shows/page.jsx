"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api/client";
import { ContentCard } from "@/components/content/ContentCard";
import { Button } from "@/components/ui/button";

export default function ShowsPage() {
    const [shows, setShows] = useState([]);
    const [language, setLanguage] = useState("en");
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    useEffect(() => {
        const fetchShows = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get("/content/shows", {
                    params: {
                        page,
                        limit: 20,
                    },
                });
                setShows(response.data.data || []);
                setTotal(response.data.pagination?.total || 0);
            } catch (error) {
                console.error("Error fetching shows:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchShows();
    }, [page]);

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-4xl font-bold mb-8">
                {language === "en" ? "TV Shows" : "المسلسلات"}
            </h1>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                        <div
                            key={i}
                            className="h-80 bg-gray-200 rounded-lg animate-pulse"
                        />
                    ))}
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {shows.map((show) => (
                            <ContentCard
                                key={show.id}
                                id={show.id}
                                title={show.title}
                                titleAr={show.titleAr}
                                description={show.description}
                                descriptionAr={show.descriptionAr}
                                posterUrl={show.posterUrl}
                                rating={show.rating}
                                type="show"
                                language={language}
                            />
                        ))}
                    </div>

                    <div className="flex justify-center gap-4">
                        <Button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                        >
                            {language === "en" ? "Previous" : "السابق"}
                        </Button>
                        <span className="flex items-center">
                            {language === "en"
                                ? `Page ${page} of ${Math.ceil(total / 20)}`
                                : `الصفحة ${page} من ${Math.ceil(total / 20)}`}
                        </span>
                        <Button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={page >= Math.ceil(total / 20)}
                        >
                            {language === "en" ? "Next" : "التالي"}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
