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

        const data = await prisma.corporateDocument.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error("CORPORATE DOCUMENTS GET ERROR:", error);
        return apiError("Unable to fetch corporate documents", 500);
    }
}

export async function POST(request) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const body = await parseJson(request);

        const title = getString(body.title);
        const type = getString(body.type);
        const documentUrl = getString(body.documentUrl);

        if (!title || !type || !documentUrl) {
            return apiError(
                "Title, type and document URL are required",
                400
            );
        }

        const data = await prisma.corporateDocument.create({
            data: {
                title,
                type,
                description:
                    getString(body.description) || null,
                documentUrl,
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        return apiError("Unable to create corporate document", 400);
    }
}