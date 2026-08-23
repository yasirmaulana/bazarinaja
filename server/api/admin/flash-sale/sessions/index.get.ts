export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  return await prisma.flashSaleConfig.findMany({
    orderBy: { startTime: 'asc' },
    include: {
      _count: { select: { products: true } }
    }
  })
})
