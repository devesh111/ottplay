import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL;
const BEARER_TOKEN = process.env.BEARER_TOKEN;

export async function POST(request) {
    try {
        const body = await request.json();
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${BEARER_TOKEN}`,
                source: "web",
                platform: "web",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Route /api/auth/register error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
