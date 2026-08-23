import { d as defineEventHandler, p as prisma } from '../../../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:module';

const config_get = defineEventHandler(async () => {
  const now = /* @__PURE__ */ new Date();
  const sessions = await prisma.flashSaleConfig.findMany({
    where: {
      isActive: true,
      endTime: { gte: now }
      // hanya yang belum selesai
    },
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { startTime: "asc" },
    take: 5
  });
  return sessions.map((s) => ({
    ...s,
    isRunning: s.startTime <= now && s.endTime >= now
  }));
});

export { config_get as default };
//# sourceMappingURL=config.get.mjs.map
