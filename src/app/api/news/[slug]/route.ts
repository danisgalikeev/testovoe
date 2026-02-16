import { NextRequest, NextResponse } from "next/server";
import news from "@/data/news.json";

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

type NewsItem = {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    date?: string;
    image?: string;
    content?: string;
};

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    await delay(700); // имитация API

    const { slug } = await params;

    const item = (news as NewsItem[]).find((n) => n.slug === slug);

    if (!item) {
        return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json(item);
}
