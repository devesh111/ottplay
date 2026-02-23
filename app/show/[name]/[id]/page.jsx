"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchShowDetails } from "@/lib/api/ottplay";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import Episodes from "@/components/content/Episodes";
import {
    Select, SelectContent, SelectGroup,
    SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

function convertDateTime(dateTimeString) {
    return new Date(dateTimeString).toDateString();
}

export default function ShowPage() {
    const { name, id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [show, setShow] = useState(null);
    const [seasonNumber, setSeasonNumber] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await fetchShowDetails({ seoUrl: `${name}/${id}` });
                const s = response?.shows?.[0] ?? null;
                setShow(s);
                if (s) setSeasonNumber(s.latest_episode?.season_number ?? 1);
            } catch (err) {
                setError("Failed to load show details");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [name, id]);

    if (loading) return <LoadingSkeleton />;

    if (error || !show) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-red-400">{error ?? "Show not found"}</p>
            </main>
        );
    }

    const showGenres = show.genres?.map((x) => x.name).join(" • ");
    const certification = show.certifications?.[0]?.certification;
    const primaryLanguage = show.primary_language?.name;
    const otherLanguages = show.other_languages?.map((x) => x.name).join(" • ");
    const showLanguages = otherLanguages ? `${primaryLanguage} • ${otherLanguages}` : primaryLanguage;
    const provider = show.where_to_watch?.[0]?.provider;
    const totalEpisodes = show.episodes?.[0]?.episodes_count;
    const seasons = show.seasons ?? [];
    const noOfSeasons = seasons.length > 1
        ? `${seasons.length} Seasons • ${totalEpisodes} eps`
        : `${seasons.length} Season • ${totalEpisodes} eps`;
    const showPoster = show.backdrops?.[0]?.url;

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink href="/shows">Shows</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>{show.name}</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                    {/* Left */}
                    <div className="w-full md:w-1/2 order-2 md:order-1">
                        <h1 className="text-3xl text-white font-semibold mb-2">{show.name}</h1>
                        {showGenres && <p className="text-sm tracking-wide">{showGenres}</p>}

                        <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                            {provider && (
                                <div className="rounded-md text-center">
                                    <Link href={`/ott-platform/${provider.seourl}`}>
                                        <img src={provider.icon_url} alt={provider.name} className="w-10 rounded-md mx-auto" />
                                    </Link>
                                </div>
                            )}
                            <div className="border border-border-bl p-2 flex gap-1 items-center rounded-md">
                                <span className="text-lg text-white font-bold">{show.ottplay_rating} </span>
                                <span className="text-xs font-bold leading-tight tracking-wide">OTTPlay Rating</span>
                            </div>
                            <div className="border border-border-bl p-2 font-bold text-sm rounded-md">{show.release_year}</div>
                            {certification && <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{certification}</div>}
                            <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{noOfSeasons}</div>
                        </div>

                        <div className="text-sm tracking-wide mt-5 mb-5 leading-relaxed">
                            {showLanguages && <p><strong>Languages: </strong>{showLanguages}</p>}
                            {show.release_date && <p><strong>Release Date: </strong>{convertDateTime(show.release_date)}</p>}
                            {show.onboarding_updated_on && <p><strong>OTT Release Date: </strong>{convertDateTime(show.onboarding_updated_on)}</p>}
                        </div>

                        <div className="tracking-wide mt-5 text-md text-white">
                            {parse(DOMPurify.sanitize(show.full_synopsis ?? ""))}
                        </div>

                        <Button className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5">
                            <PlayIcon fill="white" /> Play
                        </Button>
                    </div>

                    {/* Right */}
                    <div className="md:w-1/2 order-1 md:order-2 relative show-details-poster-image">
                        {showPoster && <img src={showPoster} alt={show.name} className="w-full h-auto" />}
                    </div>
                </div>
            </section>

            <Separator />

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                {seasons.length > 0 && (
                    <Select onValueChange={(v) => setSeasonNumber(Number(v))} value={String(seasonNumber)}>
                        <SelectTrigger className="w-full max-w-48 border-border border-2">
                            <SelectValue placeholder="Select Season" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Seasons</SelectLabel>
                                {seasons.map((season, index) => (
                                    <SelectItem key={index} value={String(season.season_number)}>
                                        Season {season.season_number}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
                {seasonNumber !== null && (
                    <Episodes seasonNumber={seasonNumber} seoUrl={`${name}/${id}`} />
                )}
            </section>
        </main>
    );
}
