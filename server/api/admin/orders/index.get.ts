export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  return await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { title: true, price: true, imageUrl: true, sessionId: true }
      }
    }
  })
})
