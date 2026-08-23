export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!
  const { isActive } = await readBody(event)
  return await prisma.flashSaleConfig.update({
    where: { id },
    data: { isActive }
  })
})
