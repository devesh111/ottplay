import { serverFetchProviderWidgets, serverFetchProviderCarouselItems } from "@/lib/api/server";
import OttProviderClient from "./OttProviderClient";

function formatProviderName(slug) {
    return slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "";
}

export async function generateMetadata({ params }) {
    const { name } = await params;
    const displayName = formatProviderName(name);
    return {
        title: displayName ? `${displayName} - Movies & Shows` : "OTT Platform",
        description: displayName
            ? `Browse all movies and TV shows available on ${displayName} on OTTPlay.`
            : "Browse content on OTTPlay.",
        openGraph: {
            title: displayName ? `${displayName} - Movies & Shows` : "OTT Platform",
            description: `Browse all content on ${displayName} via OTTPlay.`,
            type: "website",
        },
    };
}

export default async function OttProviderPage({ params }) {
    const { name, id } = await params;
    const menu = `${name}/${id}`;

    let featuredItems = [];
    let widgetMeta = [];

    try {
        const response = await serverFetchProviderWidgets({ platform: "web", menu });
        const active = response?.result?.[0]?.active ?? [];

        const activeWidgets = active.map((w) => ({
            module_name: menu,
            platform: "web",
            section: w.section,
            limit: 25,
            title: w.title,
            pin_it: w.pin_it,
            template_name: w.template_name,
            provider_id: w.provider_id,
            ottplay_id: w.ottplay_id,
            content_type: w.content_type,
        }));

        const featuredWidget = activeWidgets.find(
            (w) => w.title === "Mix Search" || w.title === "Mix Carousel" || w.title === "mix search"
        );
        widgetMeta = activeWidgets.filter(
            (w) =>
                w.title !== "Mix Search" &&
                w.title !== "mix search" &&
                w.pin_it === true &&
                w.title !== "Mix Carousel" &&
                w.content_type !== "provider_channel" &&
                w.content_type !== "live_tv"
        );

        if (featuredWidget) {
            const featuredRes = await serverFetchProviderCarouselItems(featuredWidget).catch(() => null);
            featuredItems = featuredRes?.rank ?? [];
        }
    } catch {
        // render with empty data — client can show error
    }

    return (
        <OttProviderClient
            name={name}
            featuredItems={featuredItems}
            widgetMeta={widgetMeta}
        />
    );
}
