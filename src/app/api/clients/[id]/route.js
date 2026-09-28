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

        const client = await prisma.client.update({
            where: {
                id: Number(id),
            },
            data: {
                name: getString(body.name),
                logoUrl: getString(body.logoUrl),
                website: getString(body.website) || null,
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data: client });
    } catch (error) {
        return apiError("Unable to update client", 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;

        await prisma.client.delete({
            where: {
                id: Number(id),
            },
        });

        return NextResponse.json({
            message: "Client deleted successfully",
        });
    } catch (error) {
        return apiError("Unable to delete client", 400);
    }
}