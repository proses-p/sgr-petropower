import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;
        const body = await parseJson(request);

        const data = await prisma.leadership.update({
            where: { id: Number(id) },
            data: {
                name: getString(body.name),
                position: getString(body.position),
                photoUrl: getString(body.photoUrl) || null,
                biography: getString(body.biography) || null,
                profileUrl: getString(body.profileUrl) || null,
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data });
    } catch (error) {
        return apiError("Unable to update leadership profile", 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;

        await prisma.leadership.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({
            message: "Leadership profile deleted successfully",
        });
    } catch (error) {
        return apiError("Unable to delete leadership profile", 400);
    }
}