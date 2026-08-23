import { d as defineEventHandler, r as requireAdminSession, a as readBody, c as createError, p as prisma, u as useRuntimeConfig } from '../../../../nitro/nitro.mjs';
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

const bulkNotify_post = defineEventHandler(async (event) => {
  var _a;
  requireAdminSession(event);
  const { orderIds } = await readBody(event);
  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: "orderIds wajib diisi" });
  }
  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds }, status: "PENDING_PAYMENT" },
    include: { product: true }
  });
  if (!orders.length) {
    throw createError({ statusCode: 404, statusMessage: "Tidak ada pesanan PENDING_PAYMENT yang ditemukan" });
  }
  const byPhone = /* @__PURE__ */ new Map();
  for (const order of orders) {
    const list = (_a = byPhone.get(order.buyerPhone)) != null ? _a : [];
    list.push(order);
    byPhone.set(order.buyerPhone, list);
  }
  const config = useRuntimeConfig();
  let sent = 0;
  for (const [phone, phoneOrders] of byPhone) {
    const buyerName = phoneOrders[0].buyerName;
    const lines = phoneOrders.map((o, i) => `${i + 1}. ${o.product.title} - Rp ${Number(o.product.price).toLocaleString("id-ID")}`).join("\n");
    const total = phoneOrders.reduce((sum, o) => sum + Number(o.product.price), 0);
    const message = `Halo ${buyerName},

Terima kasih telah memesan dalam program Flash Sale!

Berikut pesanan Anda:
${lines}

*Total: Rp ${total.toLocaleString("id-ID")}*

Silakan lakukan pembayaran ke rekening berikut:
Bank BCA: 1234567890 a.n. Toko Flash Sale

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`;
    await $fetch(config.fonnteUrl || "https://api.fonnte.com/send", {
      method: "POST",
      headers: { Authorization: config.fonnteToken },
      body: { target: phone, message }
    });
    const now = /* @__PURE__ */ new Date();
    await prisma.$transaction(
      phoneOrders.map(
        (o) => prisma.order.update({
          where: { id: o.id },
          data: { notifyCount: { increment: 1 }, lastNotifiedAt: now }
        })
      )
    );
    sent++;
  }
  return { success: true, sent };
});

export { bulkNotify_post as default };
//# sourceMappingURL=bulk-notify.post.mjs.map
