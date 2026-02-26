"use client";

import { useEffect, useRef, useState } from "react";
import { fetchCarouselItems } from "@/lib/api/ottplay";
import { NewReleasesCarousel } from "@/components/home/NewReleasesCarousel";
import { ProviderCarousel } from "@/components/home/ProviderCarousel";

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
                // Fire 200px before the widget enters the viewport
                rootMargin: "200px 0px",
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [widget, status]);

    const renderCarousel = () => {
        if (widget.template_name === "providers") {
            return <ProviderCarousel items={items} />;
        }
        // new_releases and all other templates use the same card style
        return <NewReleasesCarousel items={items} widgetTitle={widgetTitle} />;
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
            {/* Title placeholder */}
            <div
                className={`h-7 w-48 rounded-md mb-6 bg-accent ${
                    animate ? "animate-pulse" : "opacity-40"
                }`}
            >
                {!animate && title && <span className="sr-only">{title}</span>}
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
