import { prisma } from "@/lib/prisma";

export async function logActivity({ userId, action, entity, entityId, details }) {
    return prisma.activityLog.create({
        data: {
            userId,
            action,
            entity,
            entityId: entityId === undefined || entityId === null ? null : String(entityId),
            details: details || null,
        },
    });
}