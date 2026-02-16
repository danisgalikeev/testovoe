"use client";

import { useEffect, useState } from "react";
import styles from "../components/page.module.scss";
import { NewsCard } from "@/components/NewsCard";

type NewsItem = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
    content: string;
};

export default function HomePage() {
    const [items, setItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let alive = true;

        (async () => {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/news");
                if (!res.ok) throw new Error("Не удалось загрузить новости");
                const data = (await res.json()) as NewsItem[];

                if (alive) setItems(data);
            } catch (e: any) {
                if (alive) setError(e?.message ?? "Ошибка");
            } finally {
                if (alive) setLoading(false);
            }
        })();

        return () => {
            alive = false;
        };
    }, []);

    return (
        <section className={styles.page}>
            <div className="container">
                <h1 className={styles.title}>НОВОСТИ</h1>

                {loading && <p>Загрузка…</p>}
                {error && <p>Ошибка: {error}</p>}

                {!loading && !error && (
                    <ul className={styles.grid}>
                        {items.map((n) => (
                            <li key={n.id}>
                                <NewsCard
                                    id={n.id}
                                    slug={n.slug}
                                    title={n.title}
                                    excerpt={n.excerpt}
                                    date={n.date}
                                    image={n.image}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
