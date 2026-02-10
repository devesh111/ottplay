"use client";

import Footer from "@/components/layout/Footer";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fetchMovieDetails } from "@/lib/api/ottplay";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

const MoviePage = () => {
    const params = useParams();
    const name = params.name;
    const id = params.id;
    const [language, setLanguage] = useState("en");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [movieContent, setMovieContent] = useState({
        moviePoster: "",
        movieName: "",
        movieDescription: "",
        movieGenres: "",
        movieCasts: [],
        movieCrews: [],
        ottplayRaiting: "",
        releaseYear: "",
        runTime: "",
        certification: "",
        languages: "",
        provider: {},
        playbackUrl: "",
    });
    const [test, setTest] = useState(null);

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
        setTest("Test1");
    }, []);

    useEffect(() => {
        const fetchMovieContent = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetchMovieDetails({
                    seoUrl: name + "/" + id,
                });
                setTest("Test");

                const movie = response?.movies[0];
                const movieGenres = movie?.genres
                    .map((x) => x.name)
                    .join(" • ");
                const certification = movie?.certifications[0].certification;
                const primaryLanguage = movie?.primary_language.name;
                const otherLanguages = movie?.other_languages
                    .map((x) => x.name)
                    .join(" • ");
                const movieLanguages = otherLanguages
                    ? primaryLanguage + " • " + otherLanguages
                    : primaryLanguage;
                const ottProviderIcon =
                    movie?.where_to_watch[0].provider.icon_url;
                const ottProviderName = movie?.where_to_watch[0].provider.name;
                const ottProviderSeoUrl =
                    movie?.where_to_watch[0].provider.seourl;
                const playbackUrl =
                    movie?.where_to_watch[0].playback_details[1].playback_url;
                console.log(movie);
                console.log(movieGenres);
                setMovieContent({
                    movieName: movie.name,
                    moviePoster: movie.backdrops[0].url,
                    movieGenres: movieGenres,
                    ottplayRaiting: movie.ottplay_rating,
                    releaseYear: movie.release_year,
                    runTime: convertRunTime(movie.runTime),
                    certification: certification,
                    movieDescription: movie.full_synopsis,
                    ottReleaseDate: movie.onboarding_updated_on
                        ? convertDateTime(movie.onboarding_updated_on)
                        : null,
                    releaseDate: movie.release_date
                        ? convertDateTime(movie.release_date)
                        : null,
                    languages: movieLanguages,
                    provider: {
                        name: ottProviderName,
                        icon: ottProviderIcon,
                        url: ottProviderSeoUrl,
                    },
                    playbackUrl: playbackUrl,
                    movieCasts: movie.casts,
                    movieCrews: movie.crews,
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

        fetchMovieContent();
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
                                Movies
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        {movieContent.movieName && (
                            <BreadcrumbItem>
                                <BreadcrumbPage>
                                    {movieContent.movieName}
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
                            {movieContent.movieName && (
                                <h1 className="text-3xl text-white font-semibold mb-2">
                                    {movieContent.movieName}
                                </h1>
                            )}
                            {movieContent.movieGenres && (
                                <p className="text-sm tracking-wide">
                                    {movieContent.movieGenres}
                                </p>
                            )}
                            <div className="flex gap-2 max-w-lg mt-3 items-center justify-start text-center">
                                <div className="rounded-md text-center">
                                    {movieContent.provider && (
                                        <Link
                                            href={`/ott-platform/${movieContent.provider.url}`}
                                        >
                                            <img
                                                src={movieContent.provider.icon}
                                                alt={movieContent.provider.name}
                                                className="w-10 rounded-md mx-auto"
                                            />
                                        </Link>
                                    )}
                                </div>
                                <div className="border border-border-bl p-2 flex gap-1 items-center rounded-md">
                                    <span className="text-lg text-white font-bold">
                                        {movieContent.ottplayRaiting}{" "}
                                    </span>
                                    <span className="text-xs font-bold leading-tight tracking-wide">
                                        OTTPlay Rating
                                    </span>
                                </div>
                                <div className="border border-border-bl p-2 font-bold text-sm rounded-md">
                                    {movieContent.releaseYear}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {movieContent.certification}
                                </div>
                                <div className="border border-border-bl p-2 text-xs font-bold rounded-md">
                                    {movieContent.runTime}
                                </div>
                            </div>
                            <div className="text-sm tracking-wide mt-5 mb-5 leading-relaxed">
                                {movieContent.languages && (
                                    <p>
                                        <strong>Languages: </strong>{" "}
                                        {movieContent.languages}{" "}
                                    </p>
                                )}
                                {movieContent.releaseDate && (
                                    <p>
                                        <strong>Release Date :</strong>{" "}
                                        {movieContent.releaseDate}
                                    </p>
                                )}
                                {movieContent.ottReleaseDate && (
                                    <p>
                                        <strong>OTT Release Date:</strong>{" "}
                                        {movieContent.ottReleaseDate}
                                    </p>
                                )}
                            </div>
                            <div className="tracking-wide mt-5 text-md text-white">
                                {parse(
                                    DOMPurify.sanitize(
                                        movieContent.movieDescription,
                                    ),
                                )}
                            </div>
                            <div>
                                <Button
                                    onClick={() =>
                                        playVideo(movieContent.playbackUrl)
                                    }
                                    className="px-8 py-4 rounded-sm bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105 mt-5"
                                >
                                    <PlayIcon fill="white" /> Play
                                </Button>
                            </div>
                        </div>
                        {/* Right Content */}
                        <div className="md:w-1/2 order-1` md:order-2 relative movie-details-poster-image">
                            {movieContent.moviePoster && (
                                <img
                                    src={movieContent.moviePoster}
                                    alt={movieContent.movieName}
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

export default MoviePage;
