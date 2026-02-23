import Skeleton from "@/components/ui/skeleton";

export default function ShowLoading() {
    return (
        <main className="min-h-screen bg-background">
            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-14" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
                <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                    {/* Left */}
                    <div className="w-full md:w-1/2 order-2 md:order-1 space-y-4">
                        <Skeleton className="h-9 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-2 mt-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-10 w-28 rounded-md" />
                            <Skeleton className="h-10 w-14 rounded-md" />
                            <Skeleton className="h-10 w-12 rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-md" />
                        </div>
                        <div className="space-y-2 mt-5">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-4 w-40" />
                        </div>
                        <div className="space-y-2 mt-5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-4/5" />
                            <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-12 w-36 rounded-sm mt-5" />
                    </div>

                    {/* Right — poster */}
                    <div className="md:w-1/2 order-1 md:order-2">
                        <Skeleton className="w-full rounded-lg" style={{ aspectRatio: "16/9" }} />
                    </div>
                </div>
            </section>

            {/* Episodes section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8 space-y-4">
                <Skeleton className="h-10 w-48 rounded-md" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-sm">
                        <Skeleton className="w-40 h-24 rounded-sm flex-none" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-48" />
                            <Skeleton className="h-3 w-32" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-9 w-20 rounded-md flex-none" />
                    </div>
                ))}
            </div>
        </main>
    );
}
