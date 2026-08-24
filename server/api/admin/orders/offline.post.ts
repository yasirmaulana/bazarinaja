export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event) as {
    productId: string
    buyerName: string
    buyerPhone: string
    paymentStatus: 'PAID' | 'PENDING_PAYMENT'
  }

  if (!body.productId || !body.buyerName || !body.buyerPhone) {
    throw createError({ statusCode: 400, statusMessage: 'productId, buyerName, dan buyerPhone wajib diisi' })
  }

  const product = await prisma.product.findUnique({ where: { id: body.productId } })
  if (!product) throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan' })
  if (product.status !== 'AVAILABLE') throw createError({ statusCode: 409, statusMessage: 'Produk sudah tidak tersedia' })

  const [order] = await prisma.$transaction([
    prisma.order.create({
      data: {
        productId: body.productId,
        buyerName: body.buyerName,
        buyerPhone: body.buyerPhone,
        status: body.paymentStatus,
        source: 'OFFLINE',
      }
    }),
    prisma.product.update({
      where: { id: body.productId },
      data: { status: 'SOLD_OUT' }
    })
  ])

  return order
})
