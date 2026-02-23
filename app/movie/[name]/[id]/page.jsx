"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchMovieDetails } from "@/lib/api/ottplay";
import Link from "next/link";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

const VIDEO_URL =
    "https://vz-7335a46e-2e0.b-cdn.net/594c2931-3911-4bc3-a7ee-a085f5050931/playlist.m3u8";

function convertRunTime(time) {
    const t = time.split(":");
    return parseInt(t[0]) + " Hr " + parseInt(t[1]) + " Min";
}

function convertDateTime(dateTimeString) {
    return new Date(dateTimeString).toDateString();
}

export default function MoviePage() {
    const { name, id } = useParams();
    const [loading,  setLoading]  = useState(true);
    const [error,    setError]    = useState(null);
    const [movie,    setMovie]    = useState(null);
    const [isOpen,   setIsOpen]   = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const response = await fetchMovieDetails({ seoUrl: `${name}/${id}` });
                setMovie(response?.movies?.[0] ?? null);
            } catch {
                setError("Failed to load movie details");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [name, id]);

    // lock body scroll when player is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    if (loading) return <LoadingSkeleton />;

    if (error || !movie) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-red-400">{error ?? "Movie not found"}</p>
            </main>
        );
    }

    const movieGenres    = movie.genres?.map((x) => x.name).join(" • ");
    const certification  = movie.certifications?.[0]?.certification;
    const primaryLanguage  = movie.primary_language?.name;
    const otherLanguages   = movie.other_languages?.map((x) => x.name).join(" • ");
    const movieLanguages   = otherLanguages ? `${primaryLanguage} • ${otherLanguages}` : primaryLanguage;
    const provider   = movie.where_to_watch?.[0]?.provider;
    const moviePoster = movie.backdrops?.[0]?.url;

    return (
        <>
            {/* ── Full-screen video player overlay ── */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black"
                    style={{ touchAction: "none" }}
                >
                    <VideoPlayer
                        videoUrl={VIDEO_URL}
                        title={movie.name}
                        certification={certification}
                        onClose={() => setIsOpen(false)}
                    />
                </div>
            )}

            <main className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbLink href="/movies">Movies</BreadcrumbLink></BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem><BreadcrumbPage>{movie.name}</BreadcrumbPage></BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8 bg-section">
                    <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                        {/* Left */}
                        <div className="w-full md:w-1/2 order-2 md:order-1">
                            <h1 className="text-3xl text-white font-semibold mb-2">{movie.name}</h1>
                            {movieGenres && <p className="text-sm tracking-wide">{movieGenres}</p>}

                            <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                                {provider && (
                                    <div className="rounded-md text-center">
                                        <Link href={`/ott-platform/${provider.seourl}`}>
                                            <img src={provider.icon_url} alt={provider.name} className="w-10 rounded-md mx-auto" />
                                        </Link>
                                    </div>
                                )}
                                <div className="border border-border-bl p-2 flex gap-1 items-center rounded-md">
                                    <span className="text-lg text-white font-bold">{movie.ottplay_rating} </span>
                                    <span className="text-xs font-bold leading-tight tracking-wide">OTTPlay Rating</span>
                                </div>
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">{movie.release_year}</div>
                                {certification && <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{certification}</div>}
                                {movie.runTime && <div className="border border-border-bl p-2 text-xs font-bold rounded-md">{convertRunTime(movie.runTime)}</div>}
                            </div>

                            <div className="text-sm tracking-wide mt-5 mb-5 leading-relaxed">
                                {movieLanguages && <p><strong>Languages: </strong>{movieLanguages}</p>}
                                {movie.release_date && <p><strong>Release Date: </strong>{convertDateTime(movie.release_date)}</p>}
                                {movie.onboarding_updated_on && <p><strong>OTT Release Date: </strong>{convertDateTime(movie.onboarding_updated_on)}</p>}
                            </div>

                            <div className="tracking-wide mt-5 text-md text-white">
                                {parse(DOMPurify.sanitize(movie.full_synopsis ?? ""))}
                            </div>

                            <Button
                                onClick={() => setIsOpen(true)}
                                className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5"
                            >
                                <PlayIcon fill="white" /> Play
                            </Button>
                        </div>

                        {/* Right */}
                        <div className="md:w-1/2 order-1 md:order-2 relative movie-details-poster-image">
                            {moviePoster && <img src={moviePoster} alt={movie.name} className="w-full h-auto" />}
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
