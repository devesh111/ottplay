"use client";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchShowDetails } from "@/lib/api/ottplay";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import Episodes from "./../../../../components/content/Episodes";
import { Separator } from "@/components/ui/separator";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const ShowPage = () => {
    const params = useParams();
    const name = params.name;
    const id = params.id;
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [seasonNumber, setSeasonNumber] = useState(0);
    const [showContent, setShowContent] = useState({
        showPoster: "",
        showName: "",
        showDescription: "",
        showGenres: "",
        ottplayRaiting: "",
        releaseYear: "",
        runTime: "",
        certification: "",
        languages: "",
        provider: {},
        releaseDate: "",
        ottReleaseDate: "",
        episodes: [],
        noOfSeasons: "",
        seasons: [],
    });

    const handleSeasonChange = (value) => {
        console.log(value);
        setSeasonNumber(value);
    }

    const playVideo = (playbackUrl) => {
        return (window.location.href = playbackUrl);
    };

    const convertRunTime = (time) => {
        const t = time.split(":");
        return parseInt(t[0]) + " Hr " + parseInt(t[1]) + " Min";
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
        const fetchShowContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchShowDetails({
                    seoUrl: name + "/" + id,
                });

                const show = response?.shows[0];
                const showGenres = show?.genres.map((x) => x.name).join(" • ");
                const certification = show?.certifications[0].certification;
                const primaryLanguage = show?.primary_language.name;
                const otherLanguages = show?.other_languages
                    .map((x) => x.name)
                    .join(" • ");
                const showLanguages = otherLanguages
                    ? primaryLanguage + " • " + otherLanguages
                    : primaryLanguage;
                const ottProviderIcon =
                    show?.where_to_watch[0].provider.icon_url;
                const ottProviderName = show?.where_to_watch[0].provider.name;
                const ottProviderSeoUrl =
                    show?.where_to_watch[0].provider.seourl;
                const totlaEpisodes = show?.episodes[0].episodes_count;

                const seasons = show?.seasons;
                const noOfSeasons =
                    seasons.length > 1
                        ? seasons.length +
                          " Seasons • " +
                          totlaEpisodes +
                          " eps"
                        : seasons.length +
                          " Season • " +
                          totlaEpisodes +
                          " eps";

                console.log(show);

                setShowContent({
                    showName: show.name,
                    showPoster: show.backdrops?.[0]?.url,
                    showGenres: showGenres,
                    ottplayRaiting: show.ottplay_rating,
                    releaseYear: show.release_year,
                    // runTime: convertRunTime(show.runTime),
                    certification: certification,
                    showDescription: show.full_synopsis,
                    ottReleaseDate: show.onboarding_updated_on
                        ? convertDateTime(show.onboarding_updated_on)
                        : null,
                    releaseDate: show.release_date
                        ? convertDateTime(show.release_date)
                        : null,
                    languages: showLanguages,
                    provider: {
                        name: ottProviderName,
                        icon: ottProviderIcon,
                        url: ottProviderSeoUrl,
                    },
                    seasons: seasons,
                    noOfSeasons: noOfSeasons,
                });
                setSeasonNumber(show?.latest_episode.season_number);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load show details",
                );
            } finally {
                setLoading(false);
            }
        };

        fetchShowContent();
    }, []);

    return (
        <main className="min-h-screen bg-background">
            {/* Show Content */}
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
                        <BreadcrumbSeparator />
                        {showContent.showName && (
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {showContent.showName}
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
                            {showContent.showName && (
                                <h1 className="text-3xl text-white font-semibold mb-2">
                                    {showContent.showName}
                                </h1>
                            )}
                            {showContent.showGenres && (
                                <p className="text-sm tracking-wide">
                                    {showContent.showGenres}
                                </p>
                            )}
                            <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                                <div className="rounded-md text-center">
                                    {showContent.provider && (
                                        <Link
                                            href={`/ott-platform/${showContent.provider.url}`}
                                        >
                                            <img
                                                src={showContent.provider.icon}
                                                alt={showContent.provider.name}
                                                className="w-10 rounded-md mx-auto"
                                            />
                                        </Link>
                                    )}
                                </div>
                                <div className="border border-border-bl p-2 flex gap-1 items-center rounded-md">
                                    <span className="text-lg text-white font-bold">
                                        {showContent.ottplayRaiting}{" "}
                                    </span>
                                    <span className="text-xs font-bold leading-tight tracking-wide">
                                        OTTPlay Rating
                                    </span>
                                </div>
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">
                                    {showContent.releaseYear}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {showContent.certification}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {showContent.noOfSeasons}
                                </div>
                            </div>
                            <div className="text-sm tracking-wide mt-5 mb-5 leading-relaxed">
                                {showContent.languages && (
                                    <p>
                                        <strong>Languages: </strong>{" "}
                                        {showContent.languages}{" "}
                                    </p>
                                )}
                                {showContent.releaseDate && (
                                    <p>
                                        <strong>Release Date :</strong>{" "}
                                        {showContent.releaseDate}
                                    </p>
                                )}
                                {showContent.ottReleaseDate && (
                                    <p>
                                        <strong>OTT Release Date:</strong>{" "}
                                        {showContent.ottReleaseDate}
                                    </p>
                                )}
                            </div>
                            <div className="tracking-wide mt-5 text-md text-white">
                                {parse(
                                    DOMPurify.sanitize(
                                        showContent.showDescription,
                                    ),
                                )}
                            </div>
                            <div>
                                <Button
                                    onClick={() => playVideo("#")}
                                    className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5"
                                >
                                    <PlayIcon fill="white" /> Play
                                </Button>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="md:w-1/2 order-1` md:order-2 relative show-details-poster-image">
                            {showContent.showPoster && (
                                <img
                                    src={showContent.showPoster}
                                    alt={showContent.showName}
                                    className="w-full h-auto"
                                />
                            )}
                        </div>
                    </div>
                </section>
            )}
            <Separator />
            {!loading && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                    {showContent.seasons && (
                        <Select  onValueChange={handleSeasonChange} value={seasonNumber}>
                            <SelectTrigger className="w-full max-w-48 border-border border-2">
                                <SelectValue placeholder="Select Season" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Seasons</SelectLabel>
                                    {showContent.seasons.map(
                                        (season, index) => (
                                            <SelectItem
                                                key={index}
                                                value={season.season_number}
                                            >
                                                Season {season.season_number}
                                            </SelectItem>
                                        ),
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    )}

                    <Episodes seasonNumber={seasonNumber} seoUrl = {`${name}/${id}`} />
                </section>
            )}
        </main>
    );
};

export default ShowPage;
