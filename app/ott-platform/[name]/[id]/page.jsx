"use client";

import { useEffect, useState } from "react";
import { fetchProviderWidgets } from "@/lib/api/ottplay";
import { useParams } from "next/navigation";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";
import ErrorDisplay from "@/components/layout/ErrorDisplay";
import { ProviderWidgetCarousel } from "@/components/provider/ProviderWidgetsCarousel";
import ProviderFeaturedCarousel from "@/components/provider/ProviderFeaturedCarousel";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const OttProviderPage = () => {
    const params = useParams();
    const [widgetList, setWidgetList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [featuredItem, setFeaturedItem] = useState({});
    const [title, setTitle] = useState("");

    const name = params.name;
    const id = params.id;

    useEffect(() => {
        const fetWidgetList = async () => {
            try {
                setLoading(true);
                setError(null);
                setTitle(name);

                const response = await fetchProviderWidgets({
                    platform: "web",
                    menu: name + "/" + id,
                });
                const wList = response?.result?.[0].active;
                const activeWidgets = wList.map((w) => ({
                    module_name: `${name}/${id}`,
                    platform: "web",
                    section: w.section,
                    limit: 25,
                    title: w.title,
                    pin_it: w.pin_it,
                    template_name: w.template_name,
                    provider_id: w.provider_id,
                    ottplay_id: w.ottplay_id,
                }));

                if (activeWidgets) {
                    const featuredWidgetItem = activeWidgets.filter(
                        (item) => item.title === "Mix Search",
                    );
                    const remainingItems = activeWidgets.filter(
                        (item) => item.title !== "Mix Search",
                    );
                    setWidgetList(remainingItems);
                    if (featuredWidgetItem.length > 0) {
                        setFeaturedItem(featuredWidgetItem[0]);
                    }
                }
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load movie details",
                );
            } finally {
                setLoading(false);
            }
        };
        fetWidgetList();
    }, []);

    if (loading) {
        return <LoadingSkeleton />;
    }

    /**
     * Render error state
     * Shows error message if widget list fetch fails
     */
    if (error) {
        return <ErrorDisplay />;
    }

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
                        {title && (
                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        )}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>
            {/* Featured Carousel Section */}
            {featuredItem && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                    <div className="overflow-hidden">
                        <ProviderFeaturedCarousel
                            params={{
                                module_name: featuredItem.module_name,
                                platform: featuredItem.platform,
                                section: featuredItem.section,
                                limit: featuredItem.limit,
                                title: featuredItem.title,
                                pin_it: featuredItem.pin_it,
                                template_name: featuredItem.template_name,
                                provider_id: featuredItem.provider_id,
                            }}
                        />
                    </div>
                </section>
            )}

            {widgetList &&
                widgetList.map((widget, index) => (
                    <section
                        key={index}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pt-10"
                    >
                        <div className="overflow-hidden">
                            <ProviderWidgetCarousel
                                params={{
                                    module_name: widget.module_name,
                                    platform: widget.platform,
                                    section: widget.section,
                                    limit: widget.limit,
                                    title: widget.title,
                                    pin_it: widget.pin_it,
                                    template_name: widget.template_name,
                                    provider_id: widget.provider_id,
                                }}
                            />
                        </div>
                    </section>
                ))}
        </main>
    );
};

export default OttProviderPage;
