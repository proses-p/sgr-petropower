import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const services = await prisma.service.findMany({
            orderBy: {
                id: "asc",
            },
            include: { images: { orderBy: { sortOrder: "asc" } } },
        });

        return NextResponse.json({ data: services });
    } catch (error) {
        console.error("GET SERVICES ERROR:", error);
        return apiError("Failed to fetch services");
    }
}

export async function POST(request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const body = await parseJson(request);
        const title = getString(body.title);
        const slug = getString(body.slug);
        const description = getString(body.description);

        if (!title || !slug || !description) {
            return apiError("Title, slug and description are required", 400);
        }

        const service = await prisma.service.create({
            data: { title, slug, description },
            include: { images: true },
        });
        await logActivity({ userId: currentUser.id, action: "Created service", entity: "Service", entityId: service.id, details: service.title });

        return NextResponse.json({ data: service }, { status: 201 });

    } catch (error) {
        console.error("CREATE SERVICE ERROR:", error);
        return apiError(
            error?.code === "P2002" ? "A service with this slug already exists" : "Failed to create service",
            error?.code === "P2002" ? 409 : error instanceof SyntaxError ? 400 : 500,
        );
    }
}