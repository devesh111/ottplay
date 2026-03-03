import { serverFetchShowsList } from "@/lib/api/server";
import ShowsClient from "./ShowsClient";

const LIMIT = 20;

export const metadata = {
    title: "TV Shows",
    description: "Browse and stream the latest TV shows and web series across all OTT platforms on OTTPlay.",
    openGraph: {
        title: "TV Shows | OTTPlay",
        description: "Browse and stream the latest TV shows and web series across all OTT platforms on OTTPlay.",
        type: "website",
    },
};

export default async function ShowListingPage() {
    let initialItems = [];
    let initialNextPage = null;
    let initialTotalDocs = null;

    try {
        const response = await serverFetchShowsList({
            limit: LIMIT,
            page: 1,
            release_status: "released",
            languageFallback: "primary",
        });

        initialItems = (response.shows || []).map((item) => ({
            id: item._id || item.ottplay_id || item.name,
            title: item.name || item.title || "",
            type: item.content_type || "show",
            image: item.imageurl || item.posters?.[0] || item.backdrops?.[0]?.url || "",
            url: item.seo_url,
        }));
        initialNextPage = response.nextPage ?? null;
        initialTotalDocs = response.totalDocuments ?? null;
    } catch {
        // render empty — client shows retry
    }

    return (
        <ShowsClient
            initialItems={initialItems}
            initialNextPage={initialNextPage}
            initialTotalDocs={initialTotalDocs}
        />
    );
}
