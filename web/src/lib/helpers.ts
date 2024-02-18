export function daysInMonth(month: number, year: number): number {
    const now = new Date();
    if (!year) {
        year = now.getFullYear();
    }
    if (!month) {
        month = now.getMonth();
    }

    return new Date(year, month + 1, 0).getDate();
}

export function roundDecimal(num: number, n: number): number {
    return Math.round(num * 10 ** n) / 10 ** n;
}
