"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCarouselItems } from "@/lib/api/ottplay";
import { NewReleasesCarousel } from "@/components/home/NewReleasesCarousel";
import { ProviderCarousel } from "@/components/home/ProviderCarousel";

/**
 * Builds the /subs-see-all URL for a given home widget.
 * All widget params are forwarded as query string so the See All page
 * knows exactly which API endpoint and params to use.
 */
function buildSeeAllUrl(widget) {
    const params = new URLSearchParams({
        source: "home",
        module_name: widget.module_name || "Subscription",
        platform: widget.platform || "web",
        section: widget.section || "",
        title: widget.title || "",
        pin_it: String(widget.pin_it ?? false),
        template_name: widget.template_name || "",
    });
    if (widget.provider_id) params.set("provider_id", widget.provider_id);
    if (widget.ottplay_id) params.set("ottplay_id", widget.ottplay_id);
    return `/subs-see-all?${params.toString()}`;
}

/**
 * LazyHomeWidget — fetches carousel data for a single home widget
 * only when it scrolls into (or near) the viewport.
 *
 * Supports all home widget template types:
 *  - "providers"      → ProviderCarousel
 *  - "new_releases"   → NewReleasesCarousel
 *  - everything else  → NewReleasesCarousel (generic card list)
 */
export default function LazyHomeWidget({ widget }) {
    const ref = useRef(null);
    const [status, setStatus] = useState("idle"); // idle | loading | done | error
    const [items, setItems] = useState([]);
    const [widgetTitle, setWidgetTitle] = useState(widget.title ?? "");

    const seeAllUrl = buildSeeAllUrl(widget);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && status === "idle") {
                    observer.disconnect();
                    setStatus("loading");

                    fetchCarouselItems(widget)
                        .then((res) => {
                            setItems(res?.rank ?? []);
                            setWidgetTitle(res?.title ?? widget.title ?? "");
                            setStatus("done");
                        })
                        .catch(() => {
                            setStatus("error");
                        });
                }
            },
            {
                rootMargin: "200px 0px",
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [widget, status]);

    const renderCarousel = () => {
        if (widget.template_name === "providers") {
            return <ProviderCarousel items={items} seeAllUrl={seeAllUrl} />;
        }
        return (
            <NewReleasesCarousel
                items={items}
                widgetTitle={widgetTitle}
                seeAllUrl={seeAllUrl}
            />
        );
    };

    return (
        <div ref={ref} className="min-h-[200px]">
            {(status === "idle" || status === "loading") && (
                <WidgetSkeleton
                    title={widget.title}
                    animate={status === "loading"}
                    isProvider={widget.template_name === "providers"}
                />
            )}

            {status === "done" && items.length > 0 && renderCarousel()}

            {status === "error" && (
                <p className="text-sm text-muted-foreground py-4">
                    Failed to load &quot;{widget.title}&quot;.
                </p>
            )}
        </div>
    );
}

function WidgetSkeleton({ title, animate = false, isProvider = false }) {
    return (
        <div>
            {/* Title + See All placeholder */}
            <div className="flex items-center justify-between mb-6">
                <div
                    className={`h-7 w-48 rounded-md bg-accent ${
                        animate ? "animate-pulse" : "opacity-40"
                    }`}
                >
                    {!animate && title && (
                        <span className="sr-only">{title}</span>
                    )}
                </div>
                <div
                    className={`h-5 w-16 rounded bg-accent ${
                        animate ? "animate-pulse" : "opacity-20"
                    }`}
                />
            </div>

            {/* Card grid placeholder */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-lg bg-accent ${
                            animate ? "animate-pulse" : "opacity-20"
                        }`}
                        style={{
                            aspectRatio: isProvider ? "199/112" : "2/3",
                        }}
                    />
                ))}
            </div>
        </div>
    );
}
