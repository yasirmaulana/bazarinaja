export default defineEventHandler(async () => {
  const now = new Date()

  // Ambil sesi yang aktif atau upcoming (max 5 ke depan untuk tabs)
  const sessions = await prisma.flashSaleConfig.findMany({
    where: {
      isActive: true,
      endTime: { gte: now } // hanya yang belum selesai
    },
    include: {
      _count: { select: { products: true } }
    },
    orderBy: { startTime: 'asc' },
    take: 5
  })

  // Tandai mana yang sedang aktif
  return sessions.map(s => ({
    ...s,
    isRunning: s.startTime <= now && s.endTime >= now
  }))
})
