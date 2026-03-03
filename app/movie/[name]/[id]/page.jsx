import { serverFetchMovieDetails } from "@/lib/api/server";
import { notFound } from "next/navigation";
import MoviePageClient from "./MoviePageClient";

/** SSR: fetch movie data, generate meta tags, render shell + pass data to client */

export async function generateMetadata({ params }) {
    const { name, id } = await params;
    try {
        const response = await serverFetchMovieDetails({ seoUrl: `${name}/${id}` });
        const movie = response?.movies?.[0];
        if (!movie) return {};

        const poster = movie.backdrops?.[0]?.url || movie.posters?.[0] || "";
        const genres = movie.genres?.map((x) => x.name).join(", ") || "";
        const synopsis = (movie.short_synopsis || movie.full_synopsis || "")
            .replace(/<[^>]+>/g, "")
            .slice(0, 150);
        const title = `${movie.name}${genres ? ` (${genres})` : ""}`;
        const description = `Watch ${title} on OTTPlay.${synopsis ? ` ${synopsis}` : ""}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: poster ? [{ url: poster }] : [],
                type: "video.movie",
            },
            twitter: {
                card: "summary_large_image",
                title,
                description,
                images: poster ? [poster] : [],
            },
        };
    } catch {
        return {};
    }
}

export default async function MoviePage({ params }) {
    const { name, id } = await params;
    let movie = null;

    try {
        const response = await serverFetchMovieDetails({ seoUrl: `${name}/${id}` });
        movie = response?.movies?.[0] ?? null;
    } catch {
        // let client handle error state
    }

    if (!movie) notFound();

    return <MoviePageClient movie={movie} />;
}
