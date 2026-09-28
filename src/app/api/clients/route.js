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

        const clients = await prisma.client.findMany({
            where: includeInactive ? {} : { isActive: true },
            orderBy: { sortOrder: "asc" },
        });

        return NextResponse.json({ data: clients });
    } catch (error) {
        console.error("CLIENTS GET ERROR:", error);

        return NextResponse.json(
            {
                error: error.message,
            },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const body = await parseJson(request);

        const name = getString(body.name);
        const logoUrl = getString(body.logoUrl);

        if (!name) {
            return apiError("Client name is required", 400);
        }

        if (!logoUrl) {
            return apiError("Logo URL is required", 400);
        }

        const client = await prisma.client.create({
            data: {
                name,
                logoUrl,
                website: getString(body.website) || null,
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json(
            { data: client },
            { status: 201 }
        );
    } catch (error) {
        console.error("CLIENT POST ERROR:", error);

        return apiError("Unable to create client", 400);
    }
}