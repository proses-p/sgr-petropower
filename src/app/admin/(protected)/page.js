import { prisma } from "@/lib/prisma";
import Dashboard from "@/components/admin/Dashboard";

export default async function AdminPage() {
    const [services, projects, inquiries, unreadInquiries, recentProjects, recentInquiries] = await Promise.all([
        prisma.service.count(), prisma.project.count(), prisma.inquiry.count(), prisma.inquiry.count({ where: { status: "unread" } }),
        prisma.project.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, title: true, status: true, location: true, createdAt: true } }),
        prisma.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 5, select: { id: true, fullName: true, email: true, company: true, status: true, createdAt: true } }),
    ]);
    return <Dashboard stats={{ services, projects, inquiries, unreadInquiries }} recentProjects={recentProjects} recentInquiries={recentInquiries} />;
}