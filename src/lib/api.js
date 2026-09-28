import { NextResponse } from "next/server";

export function apiError(message, status = 500) {
    return NextResponse.json({ error: message }, { status });
}

export function getString(value) {
    return typeof value === "string" ? value.trim() : "";
}

export async function parseJson(request) {
    try {
        return await request.json();
    } catch {
        throw new SyntaxError("Invalid JSON");
    }
}

export function parseOptionalDate(value) {
    if (value === undefined || value === null || value === "") return null;

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new RangeError("Invalid date");
    return date;
}

export function parseOptionalYear(value) {
    if (value === undefined || value === null || value === "") return null;

    const year = Number(value);
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
        throw new RangeError("Invalid completion year");
    }
    return year;
}