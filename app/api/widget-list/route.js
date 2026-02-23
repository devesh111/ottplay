import { NextResponse } from "next/server";
import { serverFetchWidgetList } from "@/lib/api/server";

export async function GET() {
    try {
        const data = await serverFetchWidgetList();
        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/widget-list error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
