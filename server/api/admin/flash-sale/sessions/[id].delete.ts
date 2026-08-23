export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  await prisma.flashSaleConfig.delete({ where: { id } })
  return { success: true }
})
