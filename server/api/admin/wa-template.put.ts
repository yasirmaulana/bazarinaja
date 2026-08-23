export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const body = await readBody(event) as Record<string, string>

  await Promise.all(
    Object.entries(body).map(([key, template]) =>
      prisma.waTemplate.upsert({
        where: { key },
        update: { template },
        create: { key, template }
      })
    )
  )

  return { success: true }
})
