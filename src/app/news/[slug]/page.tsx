import { notFound } from "next/navigation";
import styles from "./page.module.scss";
import news from "@/data/news.json";
import {formatDate} from "@/lib/formatDate";
import Image from "next/image";

export const revalidate = 60;

type NewsItem = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image?: string;
    content: string;
    contentTitle: string;
};

export async function generateStaticParams() {
    return (news as NewsItem[]).map((n) => ({ slug: n.slug }));
}

export default async function NewsDetailPage(props: {
    params: Promise<{ slug: string }> | { slug: string };
}) {
    const { slug } =
        "then" in (props.params as any)
            ? await (props.params as Promise<{ slug: string }>)
            : (props.params as { slug: string });

    const item = (news as NewsItem[]).find((n) => n.slug === slug) ?? null;

    if (!item) notFound();

    return (
        <section className={styles.page}>
            <div className="container">

                <div className={styles.layout}>
                    {item.image ? (
                        <div className={styles.left}>
                            <img
                                className={styles.heroImg}
                                src={item.image}
                                alt=""
                            />
                        </div>
                    ) : null}

                    <div className={styles.right}>
                        <header className={styles.header}>
                            <h1 className={styles.title}>
                                {item.title?.trim() ? item.title : item.slug}
                            </h1>

                            <div className={styles.meta}>
                                <time dateTime={item.date}>{formatDate(item.date)}</time>
                            </div>
                        </header>

                        <div className={styles.content}>
                            <h3 className={styles.contentTitle}>
                                {item.contentTitle}
                            </h3>

                            {item.content?.trim()
                                ? item.content.split("\n").map((paragraph, index) => (
                                    <p key={index} className={styles.contentText}>
                                        {paragraph}
                                    </p>
                                ))
                                : <p className={styles.contentText}>(контент будет тут)</p>
                            }
                        </div>
                    </div>
                </div>




            </div>
            <footer className={styles.footer}>
                <div className={styles.footerContainer}>
                    <Image
                        src="/images/Logo-big.svg"
                        alt="logo"
                        width={104}
                        height={124}
                        className={styles.logo}
                    />

                    <h2 className={styles.footerTitle}>
                        Креативное агенство 500na700
                    </h2>
                </div>
            </footer>
        </section>
    );

}
