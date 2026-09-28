import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

async function findService(slug) {
    return prisma.service.findUnique({
        where: { slug },
        include: { images: { orderBy: { sortOrder: "asc" } } },
    });
}

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const service = await findService(slug);
        if (!service) return apiError("Service not found", 404);
        return NextResponse.json({ data: service });
    } catch (error) {
        console.error("GET SERVICE ERROR:", error);
        return apiError("Failed to fetch service");
    }
}

async function updateService(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const { slug } = await params;
        const body = await parseJson(request);
        const data = {};

        if (body.title !== undefined) data.title = getString(body.title);
        if (body.slug !== undefined) data.slug = getString(body.slug);
        if (body.description !== undefined) data.description = getString(body.description);

        if (Object.values(data).some((value) => !value)) {
            return apiError("Title, slug and description cannot be empty", 400);
        }
        if (!Object.keys(data).length) return apiError("At least one field is required", 400);

        const existing = await findService(slug);
        if (!existing) return apiError("Service not found", 404);

        const service = await prisma.service.update({
            where: { id: existing.id },
            data,
            include: { images: true },
        });
        await logActivity({ userId: currentUser.id, action: "Updated service", entity: "Service", entityId: service.id, details: service.title });
        return NextResponse.json({ data: service });
    } catch (error) {
        console.error("UPDATE SERVICE ERROR:", error);
        if (error?.code === "P2002") return apiError("A service with this slug already exists", 409);
        return apiError(error instanceof SyntaxError ? "Invalid JSON" : "Failed to update service", error instanceof SyntaxError ? 400 : 500);
    }
}

export const PUT = updateService;
export const PATCH = updateService;

export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const { slug } = await params;
        const service = await findService(slug);
        if (!service) return apiError("Service not found", 404);
        await prisma.service.delete({ where: { id: service.id } });
        await logActivity({ userId: currentUser.id, action: "Deleted service", entity: "Service", entityId: service.id, details: service.title });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE SERVICE ERROR:", error);
        return apiError("Failed to delete service");
    }
}