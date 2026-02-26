"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    fetchProviderWidgets,
    fetchProviderCarouselItems,
} from "@/lib/api/ottplay";
import ErrorDisplay from "@/components/layout/ErrorDisplay";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ProviderFeaturedCarousel from "@/components/provider/ProviderFeaturedCarousel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import LazyProviderWidget from "@/components/provider/Lazyproviderwidget";

export default function OttProviderPage() {
    const { name, id } = useParams();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [widgetMeta, setWidgetMeta] = useState([]); // Only metadata, no items fetched yet
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const menu = `${name}/${id}`;

                // Step 1: Fetch the widget list (lightweight — just metadata)
                const response = await fetchProviderWidgets({
                    platform: "web",
                    menu,
                });
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
                    (w) => w.title === "Mix Search" || 
                    w.title === "Mix Carousel" || 
                    w.title === "mix search",
                );
                const remaining = activeWidgets.filter(
                    (w) => w.title !== "Mix Search" && 
                    w.title !== "mix search" && 
                    w.pin_it === true && 
                    w.title !== "Mix Carousel" && 
                    w.content_type !== "provider_channel" &&
                    w.content_type !== "live_tv",
                );
                console.log(remaining);

                // Step 2: Only the featured carousel is fetched eagerly (above the fold)
                if (featuredWidget) {
                    const featuredRes = await fetchProviderCarouselItems(
                        featuredWidget,
                    ).catch(() => null);
                    setFeaturedItems(featuredRes?.rank ?? []);
                }

                // Step 3: Store only metadata for the rest — they'll be fetched on scroll
                setWidgetMeta(remaining);
            } catch (err) {
                setError("Failed to load provider page");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [name, id]);

    if (loading) return <LoadingSkeleton />;
    if (error) return <ErrorDisplay />;

    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Home</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/">Premium</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{name}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Featured carousel — fetched eagerly, always above the fold */}
            {featuredItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                    <div className="overflow-hidden">
                        <ProviderFeaturedCarousel items={featuredItems} />
                    </div>
                </section>
            )}

            {/*
                Remaining widgets — each one is a LazyProviderWidget that uses
                IntersectionObserver to trigger its own API call only when it
                scrolls into (or near) the viewport.
            */}
            {widgetMeta.map((widget, index) => (
                <section
                    key={`${widget.section}-${index}`}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-10"
                >
                    <div className="overflow-hidden">
                        <LazyProviderWidget widget={widget} />
                    </div>
                </section>
            ))}
        </main>
    );
}
