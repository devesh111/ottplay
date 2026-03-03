import { serverFetchShowDetails } from "@/lib/api/server";
import { notFound } from "next/navigation";
import ShowPageClient from "./ShowPageClient";

export async function generateMetadata({ params }) {
    const { name, id } = await params;
    try {
        const response = await serverFetchShowDetails({ seoUrl: `${name}/${id}` });
        const show = response?.shows?.[0];
        if (!show) return {};

        const poster = show.backdrops?.[0]?.url || show.posters?.[0] || "";
        const genres = show.genres?.map((x) => x.name).join(", ") || "";
        const synopsis = (show.short_synopsis || show.full_synopsis || "")
            .replace(/<[^>]+>/g, "")
            .slice(0, 150);
        const title = `${show.name}${genres ? ` (${genres})` : ""}`;
        const description = `Watch ${title} on OTTPlay.${synopsis ? ` ${synopsis}` : ""}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: poster ? [{ url: poster }] : [],
                type: "video.tv_show",
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

export default async function ShowPage({ params }) {
    const { name, id } = await params;
    let show = null;

    try {
        const response = await serverFetchShowDetails({ seoUrl: `${name}/${id}` });
        show = response?.shows?.[0] ?? null;
    } catch {
        // let client handle error state
    }

    if (!show) notFound();

    return <ShowPageClient show={show} />;
}
