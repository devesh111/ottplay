"use client";

import { useEffect, useState } from "react";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { fetchWidgetList, fetchCarouselItems } from "@/lib/api/ottplay";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import LazyHomeWidget from "@/components/home/Lazyhomewidget";

export default function Home() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [widgetMeta, setWidgetMeta] = useState([]); // widget metadata only, no carousel data yet
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);

                // Step 1: Fetch widget list — lightweight, just metadata
                const response = await fetchWidgetList();
                const active = response?.result?.[0]?.active ?? [];

                // Map raw API widget data into params we'll pass to /api/carousel
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
                console.log(allWidgets);
                // Step 2: Featured carousel ("Mix Search") loaded eagerly — it's above the fold
                const featuredWidget = allWidgets.find(
                    (w) =>
                        w.template_name === "mix_search" ||
                        w.title === "Featured Carousel",
                );
                const remaining = allWidgets.filter(
                    (w) =>
                        w.template_name !== "mix_search" &&
                        w.title !== "Featured Carousel" &&
                        w.content_type !== "sport" &&
                        w.content_type !== "provider_channel" &&
                        w.content_type !== "live_tv" &&
                        w.pin_it === true,
                );

                if (featuredWidget) {
                    const featuredRes = await fetchCarouselItems(
                        featuredWidget,
                    ).catch(() => null);
                    setFeaturedItems(featuredRes?.rank ?? []);
                }

                // Step 3: Store rest as metadata only — LazyHomeWidget fetches each on scroll
                setWidgetMeta(remaining);
            } catch (err) {
                setError("Failed to load content");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    if (loading) return <LoadingSkeleton />;
    if (error)
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-muted-foreground">
                    Failed to load content. Please try again.
                </p>
            </main>
        );

    return (
        <main className="min-h-screen bg-background">
            {/* Page header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <h1 className="text-4xl sm:text-5xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Welcome to OTTplay
                </h1>
                <p className="text-foreground mt-2">
                    Discover amazing content from around the world
                </p>
            </div>

            {/* Featured carousel — fetched eagerly, always above the fold */}
            {featuredItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                    <div className="overflow-hidden">
                        <FeaturedCarousel items={featuredItems} />
                    </div>
                </section>
            )}

            {/*
                Remaining widgets — each LazyHomeWidget mounts a skeleton placeholder
                and fires its own fetchCarouselItems() only when scrolled into view.
                rootMargin: "200px" means the fetch starts 200px before it's visible.
            */}
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

            {/* CTA footer */}
            <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-[#ec4899]/10 via-[#a855f7]/10 to-[#10b981]/10 border-t border-[#2d2d44]">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#e5e5ff]">
                        Ready to Start Watching?
                    </h2>
                    <p className="text-lg text-[#9ca3af] mb-8">
                        Join millions of users streaming unlimited movies and TV
                        shows with OTTplay
                    </p>
                    <button className="px-8 py-4 rounded-lg bg-linear-to-r from-[#ec4899] to-[#a855f7] text-white font-bold text-lg hover:shadow-2xl hover:shadow-[#ec4899]/50 transition-all transform hover:scale-105">
                        Subscribe Now
                    </button>
                </div>
            </section>
        </main>
    );
}
