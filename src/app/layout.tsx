import type { Metadata } from "next";
import { Header } from "@/components/Header";
import "../styles/globals.scss";

export const metadata: Metadata = {
    title: "Новости",
    description: "Тестовое задание: новости",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body>
        <Header />
        <main>{children}</main>
        </body>
        </html>
    );
}
