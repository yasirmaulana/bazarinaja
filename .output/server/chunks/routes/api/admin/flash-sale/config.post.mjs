import { d as defineEventHandler, r as requireAdminSession, a as readBody, c as createError, p as prisma } from '../../../../nitro/nitro.mjs';
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

const config_post = defineEventHandler(async (event) => {
  requireAdminSession(event);
  const body = await readBody(event);
  if (!body.startTime || !body.endTime) {
    throw createError({ statusCode: 400, statusMessage: "startTime dan endTime wajib diisi" });
  }
  const start = new Date(body.startTime);
  const end = new Date(body.endTime);
  if (end <= start) {
    throw createError({ statusCode: 400, statusMessage: "Waktu selesai harus lebih besar dari waktu mulai" });
  }
  return await prisma.flashSaleConfig.create({
    data: {
      title: body.title || "Flash Sale Special",
      startTime: start,
      endTime: end,
      isActive: true
    }
  });
});

export { config_post as default };
//# sourceMappingURL=config.post.mjs.map
