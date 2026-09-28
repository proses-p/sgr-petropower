import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiError } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await requireAdmin();
        const activity = await prisma.activityLog.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { user: { select: { name: true, email: true } } } });
        return NextResponse.json({ data: activity });
    } catch (error) { return apiError(error.message === "FORBIDDEN" ? "Access denied" : "Authentication required", error.message === "FORBIDDEN" ? 403 : 401); }
}