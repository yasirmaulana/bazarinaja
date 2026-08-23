import { d as defineEventHandler, r as requireAdminSession, g as getRouterParam, a as readBody, p as prisma } from '../../../../../nitro/nitro.mjs';
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

const _id__patch = defineEventHandler(async (event) => {
  requireAdminSession(event);
  const id = getRouterParam(event, "id");
  const { isActive } = await readBody(event);
  return await prisma.flashSaleConfig.update({
    where: { id },
    data: { isActive }
  });
});

export { _id__patch as default };
//# sourceMappingURL=_id_.patch.mjs.map
