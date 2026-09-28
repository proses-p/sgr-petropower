import { prisma } from "@/lib/prisma";
import { apiError } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
    if (!await getCurrentUser()) return apiError("Authentication required", 401);
    try { await prisma.media.delete({ where: { id: Number((await params).id) } }); return new NextResponse(null, { status: 204 }); }
    catch (error) { return apiError("Unable to delete media", 500); }
}