import { serverFetchWidgetList, serverFetchCarouselItems } from "@/lib/api/server";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import LazyHomeWidget from "@/components/home/Lazyhomewidget";

export const metadata = {
    title: "OTTPlay - Stream Movies & TV Shows",
    description: "Discover and watch movies, TV shows, and sports across all OTT platforms in one place.",
    openGraph: {
        title: "OTTPlay - Stream Movies & TV Shows",
        description: "Discover and watch movies, TV shows, and sports across all OTT platforms in one place.",
        type: "website",
    },
};

export default async function Home() {
    let featuredItems = [];
    let widgetMeta = [];

    try {
        const response = await serverFetchWidgetList();
        const active = response?.result?.[0]?.active ?? [];

        const allWidgets = active.map((w) => ({
            module_name: "Subscription",
            platform: "web",
            section: w.section,
            limit: w.template_name === "providers" ? 100 : 25,
            title: w.title,
            pin_it: w.pin_it ?? false,
            template_name: w.template_name ?? "",
            provider_id: w.provider_id,
            ottplay_id: w.ottplay_id,
            content_type: w.content_type,
        }));

        const featuredWidget = allWidgets.find(
            (w) => w.template_name === "mix_search" || w.title === "Featured Carousel"
        );
        widgetMeta = allWidgets.filter(
            (w) =>
                w.template_name !== "mix_search" &&
                w.title !== "Featured Carousel" &&
                w.content_type !== "sport" &&
                w.content_type !== "provider_channel" &&
                w.content_type !== "live_tv" &&
                w.pin_it === true
        );

        if (featuredWidget) {
            const featuredRes = await serverFetchCarouselItems(featuredWidget).catch(() => null);
            featuredItems = (featuredRes?.rank ?? []).filter((w) => w.content_type !== "banner");
        }
    } catch {
        // render with empty state — graceful degradation
    }

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome to OTTplay
                </h1>
                <p className="text-foreground mt-2">
                    Discover amazing content from around the world
                </p>
            </div>

            {featuredItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                    <div className="overflow-hidden">
                        <FeaturedCarousel items={featuredItems} />
                    </div>
                </section>
            )}

            {widgetMeta.map((widget, index) => (
                <section
                    key={`${widget.section}-${index}`}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3 py-5"
                >
                    <div className="overflow-hidden">
                        <LazyHomeWidget widget={widget} />
                    </div>
                </section>
            ))}

            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
                        Ready to Start Watching?
                    </h2>
                    <p className="text-lg text-[#9ca3af] mb-8">
                        Join millions of users streaming unlimited movies and TV shows with OTTplay
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
                        Subscribe Now
                    </button>
                </div>
            </section>
        </main>
    );
}
