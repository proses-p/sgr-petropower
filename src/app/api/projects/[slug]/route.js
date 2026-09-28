import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson, parseOptionalDate, parseOptionalYear } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

const projectInclude = { images: { orderBy: { sortOrder: "asc" } } };

async function findProject(slug) {
    return prisma.project.findUnique({ where: { slug }, include: projectInclude });
}

export async function GET(request, { params }) {
    try {
        const { slug } = await params;
        const project = await findProject(slug);
        if (!project) return apiError("Project not found", 404);
        return NextResponse.json({ data: project });
    } catch (error) {
        console.error("GET PROJECT ERROR:", error);
        return apiError("Failed to fetch project");
    }
}

async function updateProject(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const { slug } = await params;
        const body = await parseJson(request);
        const existing = await findProject(slug);
        if (!existing) return apiError("Project not found", 404);

        const data = {};
        if (body.title !== undefined) data.title = getString(body.title);
        if (body.slug !== undefined) data.slug = getString(body.slug);
        if (body.description !== undefined) data.description = getString(body.description);
        if (body.location !== undefined) data.location = getString(body.location) || null;
        if (body.client !== undefined) data.client = getString(body.client) || null;
        if (body.completionDate !== undefined) data.completionDate = parseOptionalDate(body.completionDate);
        if (body.completionYear !== undefined) data.completionYear = parseOptionalYear(body.completionYear);
        if (body.status !== undefined) data.status = getString(body.status);

        if (["title", "slug", "description", "status"].some((field) => field in data && !data[field])) {
            return apiError("Title, slug, description and status cannot be empty", 400);
        }
        if (!Object.keys(data).length) return apiError("At least one field is required", 400);

        const project = await prisma.project.update({ where: { id: existing.id }, data, include: projectInclude });
        await logActivity({ userId: currentUser.id, action: "Updated project", entity: "Project", entityId: project.id, details: project.title });
        return NextResponse.json({ data: project });
    } catch (error) {
        console.error("UPDATE PROJECT ERROR:", error);
        if (error?.code === "P2002") return apiError("A project with this slug already exists", 409);
        return apiError(error instanceof SyntaxError ? "Invalid JSON" : error instanceof RangeError ? error.message : "Failed to update project", error instanceof SyntaxError || error instanceof RangeError ? 400 : 500);
    }
}

export const PUT = updateProject;
export const PATCH = updateProject;

export async function DELETE(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const { slug } = await params;
        const project = await findProject(slug);
        if (!project) return apiError("Project not found", 404);
        await prisma.project.delete({ where: { id: project.id } });
        await logActivity({ userId: currentUser.id, action: "Deleted project", entity: "Project", entityId: project.id, details: project.title });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE PROJECT ERROR:", error);
        return apiError("Failed to delete project");
    }
}