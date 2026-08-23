export default defineEventHandler(async (event) => {
  const { sessionId } = getQuery(event)

  return await prisma.product.findMany({
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
      sessionId: true
    }
  })
})
