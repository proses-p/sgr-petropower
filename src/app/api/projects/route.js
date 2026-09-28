import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson, parseOptionalDate, parseOptionalYear } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

const projectInclude = { images: { orderBy: { sortOrder: "asc" } } };

export async function GET() {
    try {
        const projects = await prisma.project.findMany({ orderBy: { id: "asc" }, include: projectInclude });
        return NextResponse.json({ data: projects });
    } catch (error) {
        console.error("GET PROJECTS ERROR:", error);
        return apiError("Failed to fetch projects");
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
        if (!title || !slug || !description) return apiError("Title, slug and description are required", 400);

        const project = await prisma.project.create({
            data: {
                title,
                slug,
                description,
                location: body.location === undefined ? null : getString(body.location) || null,
                client: body.client === undefined ? null : getString(body.client) || null,
                completionDate: parseOptionalDate(body.completionDate),
                completionYear: parseOptionalYear(body.completionYear),
                status: body.status === undefined ? "COMPLETED" : getString(body.status) || "COMPLETED",
            },
            include: projectInclude,
        });
        await logActivity({ userId: currentUser.id, action: "Created project", entity: "Project", entityId: project.id, details: project.title });
        return NextResponse.json({ data: project }, { status: 201 });
    } catch (error) {
        console.error("CREATE PROJECT ERROR:", error);
        if (error?.code === "P2002") return apiError("A project with this slug already exists", 409);
        return apiError(error instanceof SyntaxError ? "Invalid JSON" : error instanceof RangeError ? error.message : "Failed to create project", error instanceof SyntaxError || error instanceof RangeError ? 400 : 500);
    }
}