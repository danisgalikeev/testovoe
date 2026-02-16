"use client";

import Link from "next/link";
import { useState } from "react";
import { ContactModal } from "@/components/ContactModal";
import styles from "./Header.module.scss";

export function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <header className={styles.header}>
                <div className="container">
                    <div className={styles.inner}>

                        <Link className={styles.logo} href="/" aria-label="На главную">
                            <img src="/images/Logo.svg" alt="logo" className={styles.logoImg} />
                        </Link>

                        <button className={styles.cta} type="button" onClick={() => setIsOpen(true)}>
                            <span>Связаться с нами</span>
                        </button>
                    </div>
                </div>
            </header>

            <ContactModal open={isOpen} onClose={() => setIsOpen(false)} />
        </>
    );
}
