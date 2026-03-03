import { serverFetchMoviesList } from "@/lib/api/server";
import MoviesClient from "./MoviesClient";

const LIMIT = 20;

export const metadata = {
    title: "Movies",
    description: "Browse and stream the latest movies across all OTT platforms on OTTPlay.",
    openGraph: {
        title: "Movies | OTTPlay",
        description: "Browse and stream the latest movies across all OTT platforms on OTTPlay.",
        type: "website",
    },
};

export default async function MovieListingPage() {
    let initialItems = [];
    let initialNextPage = null;
    let initialTotalDocs = null;

    try {
        const response = await serverFetchMoviesList({
            limit: LIMIT,
            page: 1,
            release_status: "released",
            languageFallback: "primary",
        });

        initialItems = (response.movies || []).map((item) => ({
            id: item._id || item.ottplay_id || item.name,
            title: item.name || item.title || "",
            type: item.content_type || "movie",
            image: item.imageurl || item.posters?.[0] || item.backdrops?.[0]?.url || "",
            url: item.seo_url,
        }));
        initialNextPage = response.nextPage ?? null;
        initialTotalDocs = response.totalDocuments ?? null;
    } catch {
        // render empty — client shows retry
    }

    return (
        <MoviesClient
            initialItems={initialItems}
            initialNextPage={initialNextPage}
            initialTotalDocs={initialTotalDocs}
        />
    );
}
