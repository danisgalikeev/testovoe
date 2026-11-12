import Link from "next/link";
import styles from "./NewsCard.module.scss";
import Image from "next/image";
import {formatDate} from "@/lib/formatDate";

type Props = {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    image: string;
};

export function NewsCard({ id, slug, title, excerpt, date, image }: Props) {
    return (
        <article className={styles.card}>
            <div className={styles.image}>
                {image && (
                    <Image
                        src={image}
                        alt=""
                        width={600}
                        height={400}
                        unoptimized
                        style={{ width: "100%", height: "300px" }}
                    />
                )}
            </div>

            <div className={styles.body}>


                <h2 className={styles.h}>
                    <Link href={`/news/${slug}`}>{title?.trim() ? title : `Новость ${id}`}</Link>
                </h2>

                {excerpt?.trim() ? <p className={styles.p}>{excerpt}</p> : null}

                <p className={styles.date}>
                    <time dateTime={date}>{formatDate(date)}</time>
                </p>
            </div>
        </article>
    );
}
