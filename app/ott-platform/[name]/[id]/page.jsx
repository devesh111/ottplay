"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProviderWidgets, fetchProviderCarouselItems } from "@/lib/api/ottplay";
import ErrorDisplay from "@/components/layout/ErrorDisplay";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import { ProviderWidgetCarousel } from "@/components/provider/ProviderWidgetsCarousel";
import ProviderFeaturedCarousel from "@/components/provider/ProviderFeaturedCarousel";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function OttProviderPage() {
    const { name, id } = useParams();
    const [featuredItems, setFeaturedItems] = useState([]);
    const [widgetList, setWidgetList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const menu = `${name}/${id}`;

                const response = await fetchProviderWidgets({ platform: "web", menu });
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
                }));

                const featuredWidget = activeWidgets.find((w) => w.title === "Mix Search");
                const remaining = activeWidgets.filter((w) => w.title !== "Mix Search");

                // Fetch featured + all widget carousels in parallel
                const [featuredRes, ...widgetResults] = await Promise.allSettled([
                    featuredWidget ? fetchProviderCarouselItems(featuredWidget) : Promise.resolve(null),
                    ...remaining.map((w) => fetchProviderCarouselItems(w)),
                ]);

                setFeaturedItems(
                    featuredRes.status === "fulfilled" ? featuredRes.value?.rank ?? [] : []
                );
                setWidgetList(
                    remaining.map((w, i) => ({
                        ...w,
                        items: widgetResults[i]?.status === "fulfilled" ? widgetResults[i].value?.rank ?? [] : [],
                        widgetTitle: widgetResults[i]?.status === "fulfilled" ? widgetResults[i].value?.title ?? w.title : w.title,
                    }))
                );
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
                        <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbLink href="/">Premium</BreadcrumbLink></BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem><BreadcrumbPage>{name}</BreadcrumbPage></BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {featuredItems.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                    <div className="overflow-hidden">
                        <ProviderFeaturedCarousel items={featuredItems} />
                    </div>
                </section>
            )}

            {widgetList.map((widget, index) => (
                <section key={index} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-10">
                    <div className="overflow-hidden">
                        <ProviderWidgetCarousel items={widget.items} widgetTitle={widget.widgetTitle} />
                    </div>
                </section>
            ))}
        </main>
    );
}
