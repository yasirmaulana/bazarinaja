export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.productId || !body.buyerName || !body.buyerPhone) {
    throw createError({ statusCode: 400, statusMessage: 'productId, buyerName, dan buyerPhone wajib diisi' })
  }

  // Validasi format nomor HP Indonesia
  const phoneRegex = /^(08|628|\+628)\d{8,12}$/
  if (!phoneRegex.test(body.buyerPhone)) {
    throw createError({ statusCode: 400, statusMessage: 'Format nomor HP tidak valid (gunakan format 08xxx atau 628xxx)' })
  }

  return await prisma.$transaction(async (tx) => {
    const updated = await tx.product.updateMany({
      where: { id: body.productId, status: 'AVAILABLE' },
      data: { status: 'SOLD_OUT' }
    })

    if (updated.count === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Maaf, produk ini baru saja dibeli oleh pelanggan lain!' })
    }

    const order = await tx.order.upsert({
      where: { productId: body.productId },
      create: {
        productId: body.productId,
        buyerName: body.buyerName,
        buyerPhone: body.buyerPhone,
        status: 'PENDING_PAYMENT'
      },
      update: {
        buyerName: body.buyerName,
        buyerPhone: body.buyerPhone,
        status: 'PENDING_PAYMENT',
        paymentProof: null
      }
    })

    return { success: true, order }
  })
})
