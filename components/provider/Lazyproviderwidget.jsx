"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { fetchProviderCarouselItems } from "@/lib/api/ottplay";
import { ProviderWidgetCarousel } from "@/components/provider/ProviderWidgetsCarousel";

/**
 * Builds the /subs-see-all URL for a provider widget.
 * Passes source=provider so the See All page uses the correct API.
 */
function buildSeeAllUrl(widget, name, id) {
    const params = new URLSearchParams({
        source: "provider",
        module_name: widget.module_name || "",
        platform: widget.platform || "web",
        section: widget.section || "",
        title: widget.title || "",
        pin_it: String(widget.pin_it ?? false),
        template_name: widget.template_name || "",
        // For breadcrumb display on the See All page
        provider_name: name || "",
        provider_path: `${name}/${id}`,
    });
    if (widget.provider_id) params.set("provider_id", widget.provider_id);
    if (widget.ottplay_id) params.set("ottplay_id", widget.ottplay_id);
    return `/subs-see-all?${params.toString()}`;
}

/**
 * LazyProviderWidget — fetches carousel data only when the component
 * scrolls into the viewport (via IntersectionObserver).
 */
export default function LazyProviderWidget({ widget }) {
    const { name, id } = useParams();
    const ref = useRef(null);
    const [status, setStatus] = useState("idle"); // idle | loading | done | error
    const [items, setItems] = useState([]);
    const [widgetTitle, setWidgetTitle] = useState(widget.title ?? "");

    const seeAllUrl = buildSeeAllUrl(widget, name, id);

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
                    seeAllUrl={seeAllUrl}
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
