"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchSportDetails } from "@/lib/api/ottplay";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

const SportsPage = () => {
    const params = useParams();
    const format = params.format;
    const name = params.name;
    const id = params.id;
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [sportContent, setSportContent] = useState({
        sportPoster: "",
        sportName: "",
        sportDescription: "",
        sportFormat: "",
        sportCategory: "",
        releaseYear: "",
        certification: "",
        languages: "",
        provider: {},
        playbackUrl: "",
    });

    const playVideo = (playbackUrl) => {
        return (window.location.href = playbackUrl);
    };

    const convertDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toDateString();
    };

    useEffect(() => {
        const savedLang = localStorage.getItem("language");
        if (savedLang) setLanguage(savedLang);
    }, []);

    useEffect(() => {
        const fetchSportContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchSportDetails({
                    ottplay_id: id,
                });

                const sport = response;
                console.log(sport);
                const sportFormat = ["Sports",sport.format].join(" • ");
                const certification = sport?.certifications[0].certification;
                const sportLanguage = sport?.primary_language.name;
                const ottProviderIcon =
                    sport?.where_to_watch[0].provider.icon_url;
                const ottProviderName = sport?.where_to_watch[0].provider.name;
                const ottProviderSeoUrl =
                    sport?.where_to_watch[0].provider.seourl;
                // const playbackUrl =
                    // sport?.where_to_watch[0].playback_details[1].playback_url || "";
                
                setSportContent({
                    sportName: sport.name,
                    sportPoster: sport.backdrops[0].url,
                    sportFormat: sportFormat,
                    // sportCategory: sport.sports_category,
                    releaseYear: sport.release_year,
                    certification: certification,
                    sportDescription: sport.full_synopsis,
                    ottReleaseDate: sport.onboarding_updated_on
                        ? convertDateTime(sport.onboarding_updated_on)
                        : null,
                    releaseDate: sport.release_date
                        ? convertDateTime(sport.release_date)
                        : null,
                    languages: sportLanguage,
                    provider: {
                        name: ottProviderName,
                        icon: ottProviderIcon,
                        url: ottProviderSeoUrl,
                    },
                    // playbackUrl: playbackUrl,
                });
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load movie details",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchSportContent();
    }, []);

    return (
        <main className="min-h-screen bg-background">
            {/* Movie Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/movies">
                                Sports
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {sportContent.sportName && (
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {sportContent.sportName}
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
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
                    <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                        {/* Left Content */}
                        <div className="w-full md:w-1/2 order-2 md:order-1">
                            {sportContent.sportName && (
                                <h1 className="text-3xl text-white font-semibold mb-2">
                                    {sportContent.sportName}
                                </h1>
                            )}
                            {sportContent.sportFormat && (
                                <p className="text-sm tracking-wide">
                                    {sportContent.sportFormat}
                                </p>
                            )}
                            <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                                <div className="rounded-md text-center">
                                    {sportContent.provider && (
                                        <Link
                                            href={`/ott-platform/${sportContent.provider.url}`}
                                        >
                                            <img
                                                src={sportContent.provider.icon}
                                                alt={sportContent.provider.name}
                                                className="w-10 rounded-md mx-auto"
                                            />
                                        </Link>
                                    )}
                                </div>
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">
                                    <span className="text-sm font-semibold">
                                        {sportContent.languages}{" "}
                                    </span>
                                </div>
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">
                                    {sportContent.releaseYear}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {sportContent.certification}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {sportContent.releaseDate}
                                </div>
                            </div>
                            <div className="tracking-wide mt-5 text-md text-white">
                                {parse(
                                    DOMPurify.sanitize(
                                        sportContent.sportDescription,
                                    ),
                                )}
                            </div>
                            <div>
                                <Button
                                    onClick={() =>
                                        playVideo(sportContent.playbackUrl)
                                    }
                                    className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5"
                                >
                                    <PlayIcon fill="white" /> Play
                                </Button>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="md:w-1/2 order-1` md:order-2 relative movie-details-poster-image">
                            {sportContent.sportPoster && (
                                <img
                                    src={sportContent.sportPoster}
                                    alt={sportContent.sportName}
                                    className="w-full h-auto"
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
};

export default SportsPage;
