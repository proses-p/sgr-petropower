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

        const data = await prisma.corporateDocument.update({
            where: { id: Number(id) },
            data: {
                title: getString(body.title),
                type: getString(body.type),
                description:
                    getString(body.description) || null,
                documentUrl: getString(body.documentUrl),
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data });
    } catch (error) {
        return apiError("Unable to update corporate document", 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;

        await prisma.corporateDocument.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({
            message: "Corporate document deleted successfully",
        });
    } catch (error) {
        return apiError("Unable to delete corporate document", 400);
    }
}