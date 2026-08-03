import { PrismaMariaDb } from "@prisma/adapter-mariadb";

import { getDatabaseEnv } from "@/config/env";
import { PrismaClient } from "@/generated/prisma/client";

function createPrismaClient() {
  const adapter = new PrismaMariaDb(getDatabaseEnv().DATABASE_URL);

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  saharPrisma?: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.saharPrisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.saharPrisma = prisma;
}
