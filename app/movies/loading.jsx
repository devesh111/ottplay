import Skeleton from "@/components/ui/skeleton";

export default function MoviesLoading() {
    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>

            {/* Grid skeleton */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}
