import Skeleton from "@/components/ui/skeleton";

export default function OttPlatformLoading() {
    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Featured carousel skeleton */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" style={{ aspectRatio: "16/9" }} />
                    ))}
                </div>
            </section>

            {/* Widget carousels skeleton */}
            {[...Array(3)].map((_, i) => (
                <section key={i} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                    <Skeleton className="h-7 w-48 mb-6" />
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                        {[...Array(6)].map((_, j) => (
                            <Skeleton key={j} className="rounded-lg" style={{ aspectRatio: "2/3" }} />
                        ))}
                    </div>
                </section>
            ))}
        </main>
    );
}
