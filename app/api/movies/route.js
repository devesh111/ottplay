import { NextResponse } from "next/server";
import { serverFetchMoviesList } from "@/lib/api/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const data = await serverFetchMoviesList(params);
        return NextResponse.json({
            movies: data.movies ?? [],
            totalDocuments: data.totalDocuments ?? data.total ?? 0,
            currentPage: data.currentPage ?? data.page ?? 1,
            nextPage: data.nextPage ?? null,
            prevPage: data.prevPage ?? null,
        });
    } catch (error) {
        console.error("Route /api/movies error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
