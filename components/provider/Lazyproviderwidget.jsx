"use client";

import { useEffect, useRef, useState } from "react";
import { fetchProviderCarouselItems } from "@/lib/api/ottplay";
import { ProviderWidgetCarousel } from "@/components/provider/ProviderWidgetsCarousel";

/**
 * LazyProviderWidget — fetches carousel data only when the component
 * scrolls into the viewport (via IntersectionObserver).
 */
export default function LazyProviderWidget({ widget }) {
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

                    fetchProviderCarouselItems(widget)
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
                // Start loading a bit before the widget reaches the viewport
                rootMargin: "200px 0px",
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [widget, status]);

    return (
        <div ref={ref} className="min-h-[200px]">
            {status === "idle" && <WidgetSkeleton title={widget.title} />}

            {status === "loading" && (
                <WidgetSkeleton title={widget.title} animate />
            )}

            {status === "done" && items.length > 0 && (
                <ProviderWidgetCarousel
                    items={items}
                    widgetTitle={widgetTitle}
                />
            )}

            {status === "error" && (
                <p className="text-sm text-muted-foreground py-4">
                    Failed to load &quot;{widget.title}&quot;.
                </p>
            )}
        </div>
    );
}

function WidgetSkeleton({ title, animate = false }) {
    return (
        <div>
            <div
                className={`h-7 w-48 rounded-md mb-6 bg-accent ${
                    animate ? "animate-pulse" : "opacity-40"
                }`}
            >
                {!animate && title && <span className="sr-only">{title}</span>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {[...Array(6)].map((_, i) => (
                    <div
                        key={i}
                        className={`rounded-lg bg-accent ${
                            animate ? "animate-pulse" : "opacity-20"
                        }`}
                        style={{ aspectRatio: "2/3" }}
                    />
                ))}
            </div>
        </div>
    );
}
