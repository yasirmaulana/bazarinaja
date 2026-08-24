function maskPhone(phone: string) {
  return phone.length > 3 ? phone.slice(0, -3) + 'xxx' : 'xxx'
}

export default defineEventHandler(async (event) => {
  const { sessionId } = getQuery(event)

  const products = await prisma.product.findMany({
    where: sessionId ? { sessionId: String(sessionId) } : {},
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      title: true,
      description: true,
      price: true,
      imageUrl: true,
      images: true,
      status: true,
      sessionId: true,
      order: { select: { buyerPhone: true } }
    }
  })

  return products.map(({ order, ...p }) => ({
    ...p,
    maskedPhone: p.status === 'SOLD_OUT' && order?.buyerPhone ? maskPhone(order.buyerPhone) : null
  }))
})
