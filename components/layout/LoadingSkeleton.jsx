"use client";

import React from "react";
import Skeleton from "@/components/ui/skeleton";

const LoadingSkeleton = () => {
    return (
        <main className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="space-y-12">
                    {[...Array(3)].map((_, i) => (
                        <section key={i}>
                            <div
                                data-slot="skeleton"
                                className="bg-accent animate-pulse rounded-md h-8 w-48 mb-6"
                            ></div>
                            <Skeleton className="h-8 w-48 mb-6" />
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                                {[...Array(5)].map((_, j) => (
                                    <Skeleton
                                        key={j}
                                        className="h-80 rounded-lg"
                                    />
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default LoadingSkeleton;
