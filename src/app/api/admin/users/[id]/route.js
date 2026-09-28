import { prisma } from "@/lib/prisma";
import { hashPassword, requireSuperadmin } from "@/lib/auth";
import { apiError, getString, parseJson } from "@/lib/api";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

function accessError(error) { return apiError(error.message === "FORBIDDEN" ? "Superadmin access required" : "Authentication required", error.message === "FORBIDDEN" ? 403 : 401); }
async function getTarget(id) { return prisma.user.findUnique({ where: { id: Number(id) } }); }
async function finalSuperadmin(target, changes) {
    if (target.role !== "SUPERADMIN") return false;
    const superadmins = await prisma.user.count({ where: { role: "SUPERADMIN", isActive: true } });
    return superadmins <= 1 && (changes.role === "ADMIN" || changes.isActive === false || changes.delete === true);
}

export async function PATCH(request, { params }) {
    try {
        const currentUser = await requireSuperadmin();
        const target = await getTarget((await params).id);
        if (!target) return apiError("User not found", 404);
        const body = await parseJson(request);
        const changes = {};
        if (body.name !== undefined) changes.name = getString(body.name);
        if (body.email !== undefined) changes.email = getString(body.email).toLowerCase();
        if (body.role !== undefined) changes.role = body.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN";
        if (body.isActive !== undefined) changes.isActive = Boolean(body.isActive);
        if (body.password) { if (body.password.length < 12) return apiError("Password must be at least 12 characters", 400); changes.passwordHash = await hashPassword(body.password); }
        if (!Object.keys(changes).length) return apiError("At least one field is required", 400);
        if (await finalSuperadmin(target, changes)) return apiError("The final active superadmin cannot be deactivated, demoted or deleted", 400);
        if (Object.values(changes).some((value) => value === "")) return apiError("Account fields cannot be empty", 400);
        const user = await prisma.user.update({ where: { id: target.id }, data: changes });
        await logActivity({ userId: currentUser.id, action: changes.isActive === false ? "Disabled admin" : "Updated admin", entity: "User", entityId: user.id, details: user.email });
        return NextResponse.json({ data: { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt } });
    } catch (error) {
        if (error.code === "P2002") return apiError("An account with this email already exists", 409);
        if (["FORBIDDEN", "UNAUTHENTICATED"].includes(error.message)) return accessError(error);
        return apiError("Unable to update account", 400);
    }
}

export async function DELETE(request, { params }) {
    try {
        const currentUser = await requireSuperadmin();
        const target = await getTarget((await params).id);
        if (!target) return apiError("User not found", 404);
        if (await finalSuperadmin(target, { delete: true })) return apiError("The final active superadmin cannot be deleted", 400);
        await prisma.user.delete({ where: { id: target.id } });
        await logActivity({ userId: currentUser.id, action: "Deleted admin", entity: "User", entityId: target.id, details: target.email });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        if (["FORBIDDEN", "UNAUTHENTICATED"].includes(error.message)) return accessError(error);
        return apiError("Unable to delete account", 500);
    }
}