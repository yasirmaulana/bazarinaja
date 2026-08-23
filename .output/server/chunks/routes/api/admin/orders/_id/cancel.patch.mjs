import { d as defineEventHandler, r as requireAdminSession, g as getRouterParam, p as prisma, c as createError } from '../../../../../nitro/nitro.mjs';
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

const cancel_patch = defineEventHandler(async (event) => {
  requireAdminSession(event);
  const id = getRouterParam(event, "id");
  const order = await prisma.order.findUnique({ where: { id }, select: { status: true, productId: true } });
  if (!order) throw createError({ statusCode: 404, statusMessage: "Pesanan tidak ditemukan" });
  if (order.status !== "PENDING_PAYMENT") throw createError({ statusCode: 400, statusMessage: "Hanya pesanan PENDING_PAYMENT yang bisa dibatalkan" });
  await prisma.$transaction([
    prisma.order.update({ where: { id }, data: { status: "CANCELLED" } }),
    prisma.product.update({ where: { id: order.productId }, data: { status: "AVAILABLE" } })
  ]);
  return { success: true };
});

export { cancel_patch as default };
//# sourceMappingURL=cancel.patch.mjs.map
