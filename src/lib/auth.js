import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = "sgr_admin_session";
const SESSION_DURATION = 1000 * 60 * 60 * 12;

function hashToken(token) {
    return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password) {
    const salt = randomBytes(16).toString("hex");
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const derivedKey = await scrypt(password, salt, 64);
    const expected = Buffer.from(key, "hex");
    return expected.length === derivedKey.length && timingSafeEqual(expected, derivedKey);
}

export async function createSession(userId) {
    const token = randomBytes(32).toString("hex");
    await prisma.adminSession.create({
        data: {
            tokenHash: hashToken(token),
            userId,
            expiresAt: new Date(Date.now() + SESSION_DURATION),
        },
    });

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: SESSION_DURATION / 1000,
    });
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;

    const session = await prisma.adminSession.findUnique({
        where: { tokenHash: hashToken(token) },
        include: { user: true },
    });
    if (!session) return null;
    if (!session.user.isActive) return null;
    if (session.expiresAt <= new Date()) {
        await prisma.adminSession.delete({ where: { id: session.id } }).catch(() => {});
        return null;
    }

    return { id: session.user.id, name: session.user.name, email: session.user.email, role: session.user.role };
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) throw new Error("UNAUTHENTICATED");
    return user;
}

export async function requireSuperadmin() {
    const user = await requireAdmin();
    if (user.role !== "SUPERADMIN") throw new Error("FORBIDDEN");
    return user;
}

export async function clearSession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) await prisma.adminSession.deleteMany({ where: { tokenHash: hashToken(token) } });
    cookieStore.delete(SESSION_COOKIE);
}