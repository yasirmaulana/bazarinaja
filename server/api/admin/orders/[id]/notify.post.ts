export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  const order = await prisma.order.findUnique({
    where: { id },
    include: { product: true }
  })

  if (!order) throw createError({ statusCode: 404, statusMessage: 'Order tidak ditemukan' })

  await sendPaymentNotice(
    order.buyerPhone,
    order.buyerName,
    order.product.title,
    Number(order.product.price)
  )

  await prisma.order.update({
    where: { id },
    data: { notifyCount: { increment: 1 }, lastNotifiedAt: new Date() }
  })

  return { success: true, message: 'Pesan WhatsApp berhasil dikirim' }
})
