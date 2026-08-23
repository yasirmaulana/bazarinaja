import { d as defineEventHandler, r as requireAdminSession, g as getRouterParam, p as prisma, c as createError, e as sendPaymentNotice } from '../../../../../nitro/nitro.mjs';
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

const notify_post = defineEventHandler(async (event) => {
  requireAdminSession(event);
  const id = getRouterParam(event, "id");
  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true }
  });
  if (!order) throw createError({ statusCode: 404, statusMessage: "Order tidak ditemukan" });
  await sendPaymentNotice(
    order.buyerPhone,
    order.buyerName,
    order.product.title,
    Number(order.product.price)
  );
  await prisma.order.update({
    where: { id },
    data: { notifyCount: { increment: 1 }, lastNotifiedAt: /* @__PURE__ */ new Date() }
  });
  return { success: true, message: "Pesan WhatsApp berhasil dikirim" };
});

export { notify_post as default };
//# sourceMappingURL=notify.post.mjs.map
