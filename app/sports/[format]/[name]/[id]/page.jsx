import { serverFetchSportDetails } from "@/lib/api/server";
import { notFound } from "next/navigation";
import SportsPageClient from "./SportsPageClient";

export async function generateMetadata({ params }) {
    const { id } = await params;
    try {
        const sport = await serverFetchSportDetails({ ottplay_id: id });
        if (!sport) return {};

        const poster = sport.backdrops?.[0]?.url || "";
        const synopsis = (sport.short_synopsis || sport.full_synopsis || "")
            .replace(/<[^>]+>/g, "")
            .slice(0, 150);
        const title = sport.name;
        const description = `Watch ${title} (${sport.format || "Sports"}) on OTTPlay.${synopsis ? ` ${synopsis}` : ""}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                images: poster ? [{ url: poster }] : [],
                type: "video.other",
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

export default async function SportsPage({ params }) {
    const { id } = await params;
    let sport = null;

    try {
        sport = await serverFetchSportDetails({ ottplay_id: id });
    } catch {
        // let notFound handle it
    }

    if (!sport) notFound();

    return <SportsPageClient sport={sport} />;
}
