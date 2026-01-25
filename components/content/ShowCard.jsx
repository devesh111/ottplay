"use client";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ShowCard({ show }) {
    return (
        <Link href={`/content/shows/${show.slug}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                <div className="relative h-64 bg-gray-200">
                    {show.posterUrl ? (
                        <img
                            src={show.posterUrl}
                            alt={show.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-semibold truncate">{show.title}</h3>
                    <div className="flex items-center justify-between mt-2">
                        {show.totalSeasons && (
                            <span className="text-sm text-gray-600">
                                {show.totalSeasons} Season
                                {show.totalSeasons !== 1 ? "s" : ""}
                            </span>
                        )}
                        {show.genre && (
                            <Badge variant="secondary">{show.genre.name}</Badge>
                        )}
                    </div>
                </div>
            </Card>
        </Link>
    );
}
