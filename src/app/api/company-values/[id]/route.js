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

        const data = await prisma.companyValue.update({
            where: { id: Number(id) },
            data: {
                title: getString(body.title),
                description: getString(body.description),
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data });
    } catch (error) {
        return apiError("Unable to update company value", 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;

        await prisma.companyValue.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({
            message: "Company value deleted successfully",
        });
    } catch (error) {
        return apiError("Unable to delete company value", 400);
    }
}