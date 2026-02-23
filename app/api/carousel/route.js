import { NextResponse } from "next/server";
import { serverFetchCarouselItems } from "@/lib/api/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const data = await serverFetchCarouselItems(params);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/carousel error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
