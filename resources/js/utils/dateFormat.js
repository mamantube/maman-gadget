export const IDNDateFormat = (dateSting) => {
    const date = new Date(dateSting);
    return new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    }).format(date)
}