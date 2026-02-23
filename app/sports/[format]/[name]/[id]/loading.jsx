import Skeleton from "@/components/ui/skeleton";

export default function SportsLoading() {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-3" />
                    <Skeleton className="h-4 w-32" />
                </div>
            </div>

            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2 pb-8">
                <div className="flex flex-col md:flex-row gap-5 md:gap-20">
                    <div className="w-full md:w-1/2 order-2 md:order-1 space-y-4">
                        <Skeleton className="h-9 w-3/4" />
                        <Skeleton className="h-4 w-40" />
                        <div className="flex gap-2 mt-3">
                            <Skeleton className="h-10 w-10 rounded-md" />
                            <Skeleton className="h-10 w-24 rounded-md" />
                            <Skeleton className="h-10 w-14 rounded-md" />
                            <Skeleton className="h-10 w-12 rounded-md" />
                        </div>
                        <div className="space-y-2 mt-5">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                            <Skeleton className="h-4 w-3/4" />
                        </div>
                        <Skeleton className="h-12 w-36 rounded-sm mt-5" />
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                        <Skeleton className="w-full rounded-lg" style={{ aspectRatio: "16/9" }} />
                    </div>
                </div>
            </section>
        </main>
    );
}
