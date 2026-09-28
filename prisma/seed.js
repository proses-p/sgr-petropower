const { PrismaClient } = require("../src/generated/prisma");
const {
  randomBytes,
  scrypt: scryptCallback,
} = require("node:crypto");
const { promisify } = require("node:util");

const prisma = new PrismaClient();
const scrypt = promisify(scryptCallback);

async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, 64);

  return `${salt}:${Buffer.from(derivedKey).toString("hex")}`;
}

async function main() {
  const passwordHash = await hashPassword("Sgr@Admin2026");

  await prisma.user.upsert({
    where: {
      email: "admin@sgrpetropower.co.tz",
    },
    update: {
      name: "SGR Superadmin",
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
    },
    create: {
      name: "SGR Superadmin",
      email: "admin@sgrpetropower.co.tz",
      passwordHash,
      role: "SUPERADMIN",
      isActive: true,
    },
  });

  console.log("Superadmin created successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });