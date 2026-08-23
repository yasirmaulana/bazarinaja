export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const admins = await prisma.admin.findMany({
    select: { id: true, username: true, createdAt: true },
    orderBy: { createdAt: 'asc' }
  })
  return admins
})
