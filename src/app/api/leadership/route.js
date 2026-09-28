import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request) {

    try {
        const includeInactive = new URL(request.url).searchParams.get("includeInactive") === "true";
        if (includeInactive && !await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const data = await prisma.leadership.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error("LEADERSHIP GET ERROR:", error);
        return apiError("Unable to fetch leadership", 500);
    }
    
}


export async function POST(request) {

    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const body = await parseJson(request);
        const name = getString(body.name);
        const position = getString(body.position);

        if (!name || !position) {
            return apiError("fill the required documents please");
        }

        const data = await prisma.leadership.create({
            data: {
                name,
                position,
                photoUrl: getString(body.photoUrl) || null,
                biography: getString(body.biography) || null,
                profileUrl: getString(body.profileUrl) || null,
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return apiError("Unable to create leadership profile", 400);
    }
    
}