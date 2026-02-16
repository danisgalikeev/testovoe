export function formatDate(dateString : string) {
    const date = new Date(dateString);

    return new Intl.DateTimeFormat("ru-RU", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date).replace(" г.", "");
}
