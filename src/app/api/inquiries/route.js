import { prisma } from "@/lib/prisma";
import { apiError, getString, parseJson } from "@/lib/api";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const body = await parseJson(request);
        const fullName = getString(body.fullName);
        const email = getString(body.email).toLowerCase();
        const message = getString(body.message);
        if (!fullName || !email || !message || !email.includes("@")) return apiError("Full name, a valid email and message are required", 400);
        const inquiry = await prisma.inquiry.create({ data: { fullName, email, message, phone: getString(body.phone) || null, company: getString(body.company) || null, requestedService: getString(body.requestedService) || null } });
        return NextResponse.json({ data: { id: inquiry.id, message: "Your inquiry has been received." } }, { status: 201 });
    } catch (error) {
        console.error("CREATE INQUIRY ERROR:", error);
        return apiError(error instanceof SyntaxError ? "Invalid JSON" : "Unable to submit inquiry", 400);
    }
}

export async function GET() {
    try {
        if (!await getCurrentUser()) return apiError("Authentication required", 401);
        const inquiries = await prisma.inquiry.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json({ data: inquiries });
    } catch (error) {
        console.error("GET INQUIRIES ERROR:", error);
        return apiError("Unable to load inquiries");
    }
}