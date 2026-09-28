import { prisma } from "@/lib/prisma";
import { hashPassword, requireSuperadmin } from "@/lib/auth";
import { apiError, getString, parseJson } from "@/lib/api";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

function safeUser(user) {
    return { id: user.id, name: user.name, email: user.email, role: user.role, isActive: user.isActive, createdAt: user.createdAt, updatedAt: user.updatedAt };
}

export async function GET() {
    try {
        await requireSuperadmin();
        const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
        return NextResponse.json({ data: users.map(safeUser) });
    } catch (error) {
        return apiError(error.message === "FORBIDDEN" ? "Superadmin access required" : "Authentication required", error.message === "FORBIDDEN" ? 403 : 401);
    }
}

export async function POST(request) {
    try {
        const currentUser = await requireSuperadmin();
        const body = await parseJson(request);
        const name = getString(body.name);
        const email = getString(body.email).toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";
        const role = body.role === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN";
        if (!name || !email.includes("@") || password.length < 12) return apiError("Name, valid email and a password of at least 12 characters are required", 400);
        const user = await prisma.user.create({ data: { name, email, role, passwordHash: await hashPassword(password) } });
        await logActivity({ userId: currentUser.id, action: "Created admin", entity: "User", entityId: user.id, details: `${email} (${role})` });
        return NextResponse.json({ data: safeUser(user) }, { status: 201 });
    } catch (error) {
        if (error.code === "P2002") return apiError("An account with this email already exists", 409);
        return apiError(error.message === "FORBIDDEN" ? "Superadmin access required" : error.message === "UNAUTHENTICATED" ? "Authentication required" : "Unable to create account", error.message === "FORBIDDEN" ? 403 : error.message === "UNAUTHENTICATED" ? 401 : 400);
    }
}