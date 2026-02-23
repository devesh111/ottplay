import Skeleton from "@/components/ui/skeleton";

export default function HomeLoading() {
    return (
        <main className="min-h-screen bg-background">
            {/* Page header skeleton */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Skeleton className="h-12 w-72 mb-3" />
                <Skeleton className="h-5 w-64" />
            </div>

            {/* Featured Carousel skeleton — 16/9 aspect ratio, 3 wide */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 pt-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" style={{ aspectRatio: "16/9" }} />
                    ))}
                </div>
                {/* Bullet dots */}
                <div className="flex justify-center gap-2 mt-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="w-2 h-2 rounded-full" />
                    ))}
                </div>
            </section>

            {/* New Releases skeleton — 2/3 aspect ratio, 6 wide */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Skeleton className="h-8 w-40 mb-6" />
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" style={{ aspectRatio: "2/3" }} />
                    ))}
                </div>
            </section>

            {/* Providers skeleton */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <Skeleton className="h-8 w-36 mb-6" />
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" style={{ aspectRatio: "199/112" }} />
                    ))}
                </div>
            </section>
        </main>
    );
}
