export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  await prisma.product.delete({ where: { id } })
  return { success: true }
})
