import { hashPassword } from "../src/lib/auth.js";
import { prisma } from "../src/lib/prisma.js";

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "SGR Administrator";
const role = process.env.ADMIN_ROLE === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN";

if (!email || !password || password.length < 12) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD (at least 12 characters) in .env before running admin:create.");
    process.exitCode = 1;
} else {
    const passwordHash = await hashPassword(password);
    await prisma.user.upsert({
        where: { email },
        update: { name, passwordHash, role },
        create: { name, email, passwordHash, role },
    });
    console.log(`Admin account ready for ${email} (${role}).`);
}

await prisma.$disconnect();