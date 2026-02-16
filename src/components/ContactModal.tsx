"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { IMaskInput } from "react-imask";
import styles from "./ContactModal.module.scss";

type Props = {
    open: boolean;
    onClose: () => void;
};

type Errors = {
    name?: string;
    email?: string;
    phone?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getFocusable(container: HTMLElement) {
    const selectors = [
        "a[href]",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "input:not([disabled])",
        "select:not([disabled])",
        '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
        (el) => !el.hasAttribute("disabled") && !el.getAttribute("aria-hidden")
    );
}

export function ContactModal({ open, onClose }: Props) {
    const titleId = useId();
    const contentRef = useRef<HTMLDivElement | null>(null);
    const previouslyFocusedRef = useRef<HTMLElement | null>(null);
    const closeRef = useRef<HTMLButtonElement | null>(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [errors, setErrors] = useState<Errors>({});

    const phoneDigitsCount = useMemo(
        () => form.phone.replace(/\D/g, "").length,
        [form.phone]
    );

    function validate() {
        const newErrors: Errors = {};

        if (!form.name.trim()) {
            newErrors.name = "Введите имя";
        }

        if (!form.email.trim()) {
            newErrors.email = "Введите email";
        } else if (!EMAIL_RE.test(form.email)) {
            newErrors.email = "Некорректный email";
        }

        if (phoneDigitsCount !== 11) {
            newErrors.phone = "Введите корректный телефон";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!validate()) return;

        console.log("Feedback:", form);

        setForm({
            name: "",
            email: "",
            phone: "",
        });

        setErrors({});
        onClose();
    }

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    useEffect(() => {
        if (open) {
            // чтобы попасть после монтирования/анимаций
            requestAnimationFrame(() => closeRef.current?.focus());
        }
    }, [open]);
    useEffect(() => {
        if (!open) return;

        previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

        const prevOverflow = document.body.style.overflow;
        const prevBg = document.body.style.backgroundColor;

        document.body.style.overflow = "hidden";
        if (window.innerWidth <= 520) {
            document.body.style.backgroundColor = "#ffffff";
        }

        queueMicrotask(() => {
            const root = contentRef.current;
            if (!root) return;
            const focusables = getFocusable(root);
            (focusables[0] ?? root).focus();
        });

        return () => {
            document.body.style.overflow = prevOverflow;
            document.body.style.backgroundColor = prevBg;
            previouslyFocusedRef.current?.focus?.();
            previouslyFocusedRef.current = null;
        };
    }, [open]);


    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }

            if (e.key !== "Tab") return;

            const root = contentRef.current;
            if (!root) return;

            const focusables = getFocusable(root);

            if (focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement | null;

            if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);

        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose]);

    if (!open) return null;

    return (
        <div className={styles.root} role="dialog" aria-modal="true" aria-labelledby={titleId}>
            <div
                className={styles.overlay}
                onMouseDown={(e) => {
                    if (e.target === e.currentTarget) onClose();
                }}
            />

            <div className={styles.panel} ref={contentRef} tabIndex={-1}>
                <div className={styles.head}>
                    <h2 className={styles.headTitle} id={titleId}>Связаться с нами</h2>

                    <button
                        type="button"
                        className={styles.close}
                        onClick={onClose}
                        aria-label="Закрыть"
                        ref={closeRef}
                    >
                    </button>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    <div className={styles.field}>
                            <input
                                className={styles.input}
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Имя"
                            />

                        {errors.name && (
                            <p className={styles.error}>{errors.name}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                        <IMaskInput
                            className={styles.input}
                            mask="+{7} (000) 000-00-00"
                            value={form.phone}
                            unmask={false}
                            placeholder="Телефон"
                            onAccept={(value) =>
                                setForm((prev) => ({
                                    ...prev,
                                    phone: String(value),
                                }))
                            }
                        />
                        {errors.phone && (
                            <p className={styles.error}>{errors.phone}</p>
                        )}
                    </div>

                    <div className={styles.field}>
                            <input
                                className={styles.input}
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Email"
                            />

                        {errors.email && (
                            <p className={styles.error}>{errors.email}</p>
                        )}
                    </div>

                    <div className={styles.agreeContainer}>
                        <label className={styles.customCheckbox}>
                            <input type="checkbox"
                                   className={styles.checkboxInput}/>
                            <span className={styles.checkboxBox}></span>
                            <span className={styles.checkboxLabel}>Я согласен (-а) на обработку персональных данных</span>
                        </label>
                    </div>

                    <button className={styles.submit}
                            type="submit">
                        Отправить
                    </button>
                </form>
            </div>
        </div>
    );
}
