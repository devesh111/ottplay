import Skeleton from "@/components/ui/skeleton";

export default function SearchLoading() {
    return (
        <div className="min-h-screen bg-background">
            {/* Sticky header area */}
            <div className="border-b sticky top-0 bg-background/95 z-40 px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <Skeleton className="h-8 w-20 rounded-md" />
                        <Skeleton className="h-7 w-36" />
                    </div>
                    <Skeleton className="h-10 w-full max-w-2xl mx-auto rounded-md" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <Skeleton className="h-4 w-48 mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, i) => (
                        <div key={i} className="flex flex-col gap-3">
                            <Skeleton className="h-64 w-full rounded-lg" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-full rounded-md" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
