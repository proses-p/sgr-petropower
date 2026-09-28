import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export default async function AdminLoginPage() {
    const user = await getCurrentUser();
    if (user) redirect("/admin");
    return <AdminLoginForm />;
}
