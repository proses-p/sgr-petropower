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

        const data = await prisma.certification.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ data });
    } catch (error) {
        console.error("CERTIFICATIONS GET ERROR:", error);
        return apiError("Unable to fetch certifications", 500);
    }
}

export async function POST(request) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const body = await parseJson(request);

        const title = getString(body.title);

        if (!title) {
            return apiError("Certification title is required", 400);
        }

        const data = await prisma.certification.create({
            data: {
                title,
                issuingOrganization:
                    getString(body.issuingOrganization) || null,
                year: getString(body.year) || null,
                description:
                    getString(body.description) || null,
                documentUrl:
                    getString(body.documentUrl) || null,
                type:
                    getString(body.type) || "CERTIFICATION",
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data }, { status: 201 });
    } catch (error) {
        console.error("CERTIFICATION POST ERROR:", error);
        return apiError("Unable to create certification", 400);
    }
}