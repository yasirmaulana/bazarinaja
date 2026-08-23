export default defineEventHandler(async (event) => {
  const { sessionId } = getQuery(event)
  return await prisma.product.findMany({
    where: sessionId ? { sessionId: String(sessionId) } : {},
    select: { id: true, status: true }
  })
})
