import { d as defineEventHandler, r as requireAdminSession, g as getRouterParam, p as prisma } from '../../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  requireAdminSession(event);
  const id = getRouterParam(event, "id");
  await prisma.product.delete({ where: { id } });
  return { success: true };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
