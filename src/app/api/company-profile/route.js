import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { logActivity } from "@/lib/activity";
import { NextResponse } from "next/server";

const fields = ["companyName", "about", "mission", "vision", "phone", "email", "address", "website", "linkedin", "instagram"];

export async function GET() {
    try {
        const profile = await prisma.companyProfile.findUnique({ where: { id: 1 } });
        return NextResponse.json({ data: profile });
    } catch (error) { return apiError("Unable to load company profile"); }
}

export async function PUT(request) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) return apiError("Authentication required", 401);
        const body = await parseJson(request);
        const data = Object.fromEntries(fields.filter((field) => body[field] !== undefined).map((field) => [field, getString(body[field]) || null]));
        if (!data.companyName || !data.about) return apiError("Company name and about description are required", 400);
        const profile = await prisma.companyProfile.upsert({ where: { id: 1 }, update: data, create: { id: 1, companyName: data.companyName, about: data.about, ...data } });
        await logActivity({ userId: currentUser.id, action: "Updated company profile", entity: "CompanyProfile", entityId: profile.id });
        return NextResponse.json({ data: profile });
    } catch (error) { return apiError(error instanceof SyntaxError ? "Invalid JSON" : "Unable to save company profile", 400); }
}