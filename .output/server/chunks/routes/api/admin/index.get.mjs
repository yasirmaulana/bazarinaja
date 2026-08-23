import { d as defineEventHandler, r as requireAdminSession, p as prisma } from '../../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  requireAdminSession(event);
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      product: {
        select: { title: true, price: true, imageUrl: true }
      }
    }
  });
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
