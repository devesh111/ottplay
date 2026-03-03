import { serverFetchSearchAllContent } from "@/lib/api/server";
import SearchClient from "./SearchClient";

const LIMIT = 20;

export async function generateMetadata({ searchParams }) {
    const { q } = await searchParams;
    const query = q ?? "";
    return {
        title: query ? `Search results for "${query}"` : "Search",
        description: query
            ? `Find movies, shows and sports matching "${query}" on OTTPlay.`
            : "Search for movies, TV shows, and sports on OTTPlay.",
    };
}

export default async function SearchPage({ searchParams }) {
    const { q } = await searchParams;
    const query = q ?? "";

    let initialItems = [];
    let initialNextPage = null;
    let initialTotalDocs = null;

    if (query.trim()) {
        try {
            const response = await serverFetchSearchAllContent({
                query,
                limit: LIMIT,
                type: "all",
                page: 1,
            });
            initialItems = (response.result || []).map((item) => ({
                id: item._id || item.ottplay_id || item.name,
                title: item.name || item.title || "",
                type: item.content_type || "content",
                image: item.imageurl || item.posters?.[0] || item.backdrops?.[0]?.url || "",
                url: getItemLink(item),
            }));
            initialNextPage = response.nextPage ?? null;
            initialTotalDocs = response.totalDocuments ?? null;
        } catch {
            // pass empty — client can retry
        }
    }

    return (
        <SearchClient
            query={query}
            initialItems={initialItems}
            initialNextPage={initialNextPage}
            initialTotalDocs={initialTotalDocs}
        />
    );
}

function getItemLink(item) {
    if (item.content_type === "movie") return "/movie/" + item.seo_url;
    if (item.content_type === "show") return "/show/" + item.seo_url;
    if (item.content_type === "sport") return "/sports/" + item.format + "/" + item.seo_url;
    return "#";
}
