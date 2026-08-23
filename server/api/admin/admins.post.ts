import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const { username, password } = await readBody(event)

  if (!username?.trim() || !password?.trim()) {
    throw createError({ statusCode: 400, statusMessage: 'Username dan password wajib diisi' })
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 6 karakter' })
  }

  const exists = await prisma.admin.findUnique({ where: { username } })
  if (exists) throw createError({ statusCode: 409, statusMessage: 'Username sudah digunakan' })

  const hashed = await bcrypt.hash(password, 10)
  const admin = await prisma.admin.create({
    data: { username, password: hashed },
    select: { id: true, username: true, createdAt: true }
  })
  return admin
})
