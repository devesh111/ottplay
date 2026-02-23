import { NextResponse } from "next/server";
import { serverFetchSportDetails } from "@/lib/api/server";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());
        const data = await serverFetchSportDetails(params);
        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/sport-details error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
