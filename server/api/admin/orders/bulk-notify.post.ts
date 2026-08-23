export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { orderIds } = await readBody(event)

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'orderIds wajib diisi' })
  }

  const orders = await prisma.order.findMany({
    where: { id: { in: orderIds }, status: 'PENDING_PAYMENT' },
    include: { product: true }
  })

  if (!orders.length) {
    throw createError({ statusCode: 404, statusMessage: 'Tidak ada pesanan PENDING_PAYMENT yang ditemukan' })
  }

  // Group by buyerPhone — same phone → one message
  const byPhone = new Map<string, typeof orders>()
  for (const order of orders) {
    const list = byPhone.get(order.buyerPhone) ?? []
    list.push(order)
    byPhone.set(order.buyerPhone, list)
  }

  const config = useRuntimeConfig()
  const template = await getBulkTemplate()
  let sent = 0

  for (const [phone, phoneOrders] of byPhone) {
    const buyerName = phoneOrders[0].buyerName
    const items = phoneOrders
      .map((o, i) => `${i + 1}. ${o.product.title} - Rp ${Number(o.product.price).toLocaleString('id-ID')}`)
      .join('\n')
    const total = phoneOrders.reduce((sum, o) => sum + Number(o.product.price), 0)

    const message = template
      .replace(/{{name}}/g, buyerName)
      .replace(/{{items}}/g, items)
      .replace(/{{total}}/g, total.toLocaleString('id-ID'))
      .replace(/{{bank_info}}/g, config.bankInfo || 'Bank BCA: 1234567890 a.n. Toko Flash Sale')

    await $fetch(config.fonnteUrl || 'https://api.fonnte.com/send', {
      method: 'POST',
      headers: { Authorization: config.fonnteToken },
      body: { target: phone, message }
    })

    const now = new Date()
    await prisma.$transaction(
      phoneOrders.map(o =>
        prisma.order.update({
          where: { id: o.id },
          data: { notifyCount: { increment: 1 }, lastNotifiedAt: now }
        })
      )
    )
    sent++
  }

  return { success: true, sent }
})
