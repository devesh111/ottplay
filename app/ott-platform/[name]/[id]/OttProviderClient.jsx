"use client";

import ProviderFeaturedCarousel from "@/components/provider/ProviderFeaturedCarousel";
import {
    Breadcrumb, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import LazyProviderWidget from "@/components/provider/Lazyproviderwidget";

export default function OttProviderClient({ name, featuredItems, widgetMeta }) {
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
