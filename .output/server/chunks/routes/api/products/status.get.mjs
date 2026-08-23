import { d as defineEventHandler, h as getQuery, p as prisma } from '../../../nitro/nitro.mjs';
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

const status_get = defineEventHandler(async (event) => {
  const { sessionId } = getQuery(event);
  return await prisma.product.findMany({
    where: sessionId ? { sessionId: String(sessionId) } : {},
    select: { id: true, status: true }
  });
});

export { status_get as default };
//# sourceMappingURL=status.get.mjs.map
