import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function ProtectedAdminLayout({ children }) {
    const user = await getCurrentUser();
    if (!user) redirect("/admin/login");
    return <AdminShell user={user}>{children}</AdminShell>;
}