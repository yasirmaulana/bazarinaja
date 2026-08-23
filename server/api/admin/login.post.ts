import bcrypt from 'bcryptjs'

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event)

  const admin = await prisma.admin.findUnique({ where: { username } })
  if (!admin || !(await bcrypt.compare(password, admin.password))) {
    throw createError({ statusCode: 401, statusMessage: 'Username atau password salah' })
  }

  setCookie(event, 'admin_session', 'authenticated', {
    sameSite: 'strict',
    maxAge: 60 * 60 * 8
  })

  return { success: true }
})
