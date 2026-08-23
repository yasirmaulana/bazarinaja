export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event)

  if (!body.startTime || !body.endTime) {
    throw createError({ statusCode: 400, statusMessage: 'startTime dan endTime wajib diisi' })
  }

  const start = new Date(body.startTime)
  const end = new Date(body.endTime)

  if (end <= start) {
    throw createError({ statusCode: 400, statusMessage: 'Waktu selesai harus lebih besar dari waktu mulai' })
  }

  return await prisma.flashSaleConfig.create({
    data: {
      title: body.title || 'Flash Sale Special',
      startTime: start,
      endTime: end,
      isActive: true
    }
  })
})
