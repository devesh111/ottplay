"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchSportDetails } from "@/lib/api/ottplay";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

function convertDateTime(dateTimeString) {
    return new Date(dateTimeString).toDateString();
}

export default function SportsPage() {
    const { format, name, id } = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sport, setSport] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await fetchSportDetails({ ottplay_id: id });
                setSport(response ?? null);
            } catch (err) {
                setError("Failed to load sport details");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    if (loading) return <LoadingSkeleton />;

    if (error || !sport) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-red-400">{error ?? "Sport not found"}</p>
            </main>
        );
    }

    const sportFormat = ["Sports", sport.format].join(" • ");
    const certification = sport.certifications?.[0]?.certification;
    const sportLanguage = sport.primary_language?.name;
    const provider = sport.where_to_watch?.[0]?.provider;
    const sportPoster = sport.backdrops?.[0]?.url;

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink href="/">Sports</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>{sport.name}</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                    {/* Left */}
                    <div className="w-full md:w-1/2 order-2 md:order-1">
                        <h1 className="text-3xl text-white font-semibold mb-2">{sport.name}</h1>
                        <p className="text-sm tracking-wide">{sportFormat}</p>

                        <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                            {provider && (
                                <div className="rounded-md text-center">
                                    <Link href={`/ott-platform/${provider.seourl}`}>
                                        <img src={provider.icon_url} alt={provider.name} className="w-10 rounded-md mx-auto" />
                                    </Link>
                                </div>
                            )}
                            {sportLanguage && (
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">
                                    <span className="text-sm font-semibold">{sportLanguage}</span>
                                </div>
                            )}
                            <div className="border border-border-bl p-2 font-bold text-sm rounded-md">{sport.release_year}</div>
                            {certification && <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{certification}</div>}
                            {sport.release_date && (
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{convertDateTime(sport.release_date)}</div>
                            )}
                        </div>

                        <div className="tracking-wide mt-5 text-md text-white">
                            {parse(DOMPurify.sanitize(sport.full_synopsis ?? ""))}
                        </div>

                        <Button className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5">
                            <PlayIcon fill="white" /> Play
                        </Button>
                    </div>

                    {/* Right */}
                    <div className="md:w-1/2 order-1 md:order-2 relative movie-details-poster-image">
                        {sportPoster && <img src={sportPoster} alt={sport.name} className="w-full h-auto" />}
                    </div>
                </div>
            </section>
        </main>
    );
}
