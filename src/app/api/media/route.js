import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
    if (!await getCurrentUser()) return apiError("Authentication required", 401);
    const media = await prisma.media.findMany({ orderBy: [{ location: "asc" }, { sortOrder: "asc" }] });
    return NextResponse.json({ data: media });
}

export async function POST(request) {
    try {
        if (!await getCurrentUser()) return apiError("Authentication required", 401);
        const body = await parseJson(request);
        const url = getString(body.url);
        if (!url) return apiError("Image URL is required", 400);
        const media = await prisma.media.create({ data: { url, alt: getString(body.alt) || null, title: getString(body.title) || null, location: getString(body.location) || "homepage", serviceId: body.serviceId ? Number(body.serviceId) : null, projectId: body.projectId ? Number(body.projectId) : null, sortOrder: Number(body.sortOrder) || 0 } });
        return NextResponse.json({ data: media }, { status: 201 });
    } catch (error) { return apiError("Unable to save media", 400); }
}