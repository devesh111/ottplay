import { NextResponse } from "next/server";
import { serverFetchSearchAllContent } from "@/lib/api/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const data = await serverFetchSearchAllContent(params);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/search-all error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
