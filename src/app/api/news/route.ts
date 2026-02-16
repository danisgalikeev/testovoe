import { NextRequest, NextResponse } from "next/server";
import news from "@/data/news.json";

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function GET() {
    await delay(700); // имитация API
    return NextResponse.json(news);
}
