import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

async function authorized() { return Boolean(await getCurrentUser()); }

export async function GET(request, { params }) {
    if (!await authorized()) return apiError("Authentication required", 401);
    const inquiry = await prisma.inquiry.findUnique({ where: { id: Number((await params).id) } });
    return inquiry ? NextResponse.json({ data: inquiry }) : apiError("Inquiry not found", 404);
}

export async function PATCH(request, { params }) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const body = await parseJson(request);
        const status = getString(body.status).toLowerCase();
        if (!["unread", "read", "responded"].includes(status)) return apiError("Status must be unread, read or responded", 400);
        const inquiry = await prisma.inquiry.update({ where: { id: Number((await params).id) }, data: { status } });
        await logActivity({ userId: currentUser.id, action: "Changed inquiry status", entity: "Inquiry", entityId: inquiry.id, details: status });
        return NextResponse.json({ data: inquiry });
    } catch (error) {
        console.error("UPDATE INQUIRY ERROR:", error);
        return apiError(error?.code === "P2025" ? "Inquiry not found" : "Unable to update inquiry", error?.code === "P2025" ? 404 : 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        if (!await authorized()) return apiError("Authentication required", 401);
        await prisma.inquiry.delete({ where: { id: Number((await params).id) } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("DELETE INQUIRY ERROR:", error);
        return apiError(error?.code === "P2025" ? "Inquiry not found" : "Unable to delete inquiry", error?.code === "P2025" ? 404 : 500);
    }
}