import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'File tidak ditemukan' })

  const file = formData.find(f => f.name === 'proof')
  if (!file || !file.filename) throw createError({ statusCode: 400, statusMessage: 'File bukti transfer wajib diupload' })

  const filename = `proof-${Date.now()}-${file.filename}`
  const filePath = join(process.cwd(), 'public', 'uploads', filename)
  await writeFile(filePath, file.data)

  const updated = await prisma.order.update({
    where: { id },
    data: {
      paymentProof: `/uploads/${filename}`,
      status: 'PAID'
    }
  })

  return { success: true, order: updated }
})
