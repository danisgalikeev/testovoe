import fs from "node:fs/promises";
import path from "node:path";

export type NewsItem = {
    id: number;
    slug: string | number;
    title: string;
    excerpt: string;
    date: string;   // YYYY-MM-DD
    image?: string; // опционально
    content: string;
};

function delay(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

async function readNewsJson(): Promise<NewsItem[]> {
    const filePath = path.join(process.cwd(), "data", "news.json");
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as NewsItem[];
}

export async function getNewsList(delayMs = 0): Promise<NewsItem[]> {
    if (delayMs > 0) await delay(delayMs);
    return readNewsJson();
}

export async function getNewsBySlug(slug: string, delayMs = 0): Promise<NewsItem | null> {
    if (delayMs > 0) await delay(delayMs);

    const normalized = String(slug).trim();
    const items = await readNewsJson();

    return (
        items.find((n) => String(n.slug).trim() === normalized) ?? null
    );
}

