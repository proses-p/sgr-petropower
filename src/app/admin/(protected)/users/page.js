import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import UserManager from "@/components/admin/UserManager";

export default async function UsersPage() {
    const user = await getCurrentUser();
    if (user?.role !== "SUPERADMIN") redirect("/admin");
    return <UserManager />;
}