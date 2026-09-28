import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";
import { getString, parseJson } from "@/lib/api";

export async function POST(request) {
    try {
        const body = await parseJson(request);
        const email = getString(body.email).toLowerCase();
        const password = typeof body.password === "string" ? body.password : "";
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive || !(await verifyPassword(password, user.passwordHash))) {
            return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
        }
        await createSession(user.id);
        return NextResponse.json({ data: { name: user.name, email: user.email, role: user.role } });
    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);
        return NextResponse.json({ error: "Unable to sign in" }, { status: 400 });
    }
}