export const IDRCurrency = (amount) => {
    if (!["number", "string"].includes(typeof amount)) return 0;

    let result = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
    }).format(amount);

    return result.replace("Rp", "IDR");
} 