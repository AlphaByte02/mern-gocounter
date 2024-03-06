export function isEmpty(element: unknown) {
    if ((element || null) === null) {
        return true;
    }

    switch (typeof element) {
        case "object": {
            if (Array.isArray(element)) {
                return element.length === 0;
            } else {
                for (const _ in element) {
                    return false;
                }
                return true;
            }
        }
        default:
            return false;
    }
}

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

export function dateRange(startDate: Date | string, endDate: Date | string, steps = 1, useUTC = false) {
    const dateArray = [];

    if (!(startDate instanceof Date)) {
        startDate = new Date(startDate);
    }
    if (useUTC) {
        startDate.setUTCHours(0, 0, 0, 0);
    } else {
        startDate.setHours(0, 0, 0, 0);
    }
    const currentDate = startDate;

    if (!(endDate instanceof Date)) {
        endDate = new Date(endDate);
    }
    if (useUTC) {
        endDate.setUTCHours(0, 0, 0, 0);
    } else {
        endDate.setHours(0, 0, 0, 0);
    }

    while (currentDate <= endDate) {
        dateArray.push(new Date(currentDate));
        if (useUTC) {
            currentDate.setUTCDate(currentDate.getUTCDate() + steps);
        } else {
            currentDate.setDate(currentDate.getDate() + steps);
        }
    }

    return dateArray;
}
