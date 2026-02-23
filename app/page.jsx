"use client";

import { useEffect, useState } from "react";
import FeaturedCarousel from "@/components/home/FeaturedCarousel";
import { NewReleasesCarousel } from "@/components/home/NewReleasesCarousel";
import { ProviderCarousel } from "@/components/home/ProviderCarousel";
import { fetchCarouselItems } from "@/lib/api/ottplay";
import LoadingSkeleton from "@/components/layout/LoadingSkeleton";

export default function Home() {
    const [featuredItems, setFeaturedItems] = useState([]);
    const [newReleaseItems, setNewReleaseItems] = useState([]);
    const [providerItems, setProviderItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const [featuredRes, newReleasesRes, providersRes] =
                    await Promise.allSettled([
                        fetchCarouselItems({
                            module_name: "Home",
                            platform: "web",
                            section: "widget_mix_search",
                            limit: 50,
                            title: "Featured+Carousel",
                        }),
                        fetchCarouselItems({
                            module_name: "Subscription",
                            platform: "web",
                            section: "widget_new_release_27",
                            limit: 15,
                            title: "NewReleases",
                            template_name: "new_releases",
                            pin_it: true,
                        }),
                        fetchCarouselItems({
                            module_name: "Subscription",
                            platform: "web",
                            section: "widget__oTTplay_partners",
                            limit: 100,
                            title: "OTTplay+partners",
                            template_name: "providers",
                            pin_it: false,
                        }),
                    ]);

                setFeaturedItems(
                    featuredRes.status === "fulfilled"
                        ? featuredRes.value?.rank ?? []
                        : []
                );
                setNewReleaseItems(
                    newReleasesRes.status === "fulfilled"
                        ? newReleasesRes.value?.rank ?? []
                        : []
                );
                setProviderItems(
                    providersRes.status === "fulfilled"
                        ? providersRes.value?.rank ?? []
                        : []
                );
            } catch (err) {
                setError("Failed to load content");
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <LoadingSkeleton />;

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

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 pb-10 pt-5 bg-section">
                <div className="overflow-hidden">
                    <FeaturedCarousel items={featuredItems} />
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-10">
                <div className="overflow-hidden">
                    <NewReleasesCarousel items={newReleaseItems} />
                </div>
            </section>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 py-10">
                <div className="overflow-hidden">
                    <ProviderCarousel items={providerItems} />
                </div>
            </section>

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
