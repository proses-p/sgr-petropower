import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required:", 401);
        }

        const { id } = await params;
        const body = await parseJson(request);
        const data = await prisma.companyStat.update({
            where: { id: Number(id) },
            data: {
                label: getString(body.label),
                value: getString(body.value),
                sortOrder: Number(body.sortOrder) || 0,
                isActive: body.isActive !== false,
            },
        });

        return NextResponse.json({ data });
    } catch (error) {
        return apiError("Unable to update company stats", 400);
    }
    
}

export async function DELETE(request, { params }) { 
    try {
        if (!await getCurrentUser()) {
            return apiError("Authentication required", 401);
        }

        const { id } = await params;

        await prisma.companyStat.delete({
            where: { id: Number(id) },
        });

        return NextResponse.json({
            message: "Comany stat deleted successfull",
        });
    } catch (error) {
        return apiError("Unable to delete company stat", 400);
    }
    
}