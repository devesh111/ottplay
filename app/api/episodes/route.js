import { NextResponse } from "next/server";
import { serverFetchEpisodes } from "@/lib/api/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const data = await serverFetchEpisodes(params);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/episodes error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
