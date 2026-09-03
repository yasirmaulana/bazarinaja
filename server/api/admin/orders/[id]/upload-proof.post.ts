export default defineEventHandler(async (event) => {
  requireAdminSession(event)
  const id = getRouterParam(event, 'id')!

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'File tidak ditemukan' })

  const file = formData.find(f => f.name === 'proof')
  if (!file || !file.filename) throw createError({ statusCode: 400, statusMessage: 'File bukti transfer wajib diupload' })

  const filename = `${Date.now()}-${file.filename}`
  const proofUrl = await uploadToS3(file.data, filename, file.type ?? 'application/octet-stream', 'proofs')

  const updated = await prisma.order.update({
    where: { id },
    data: {
      paymentProof: proofUrl,
      status: 'PAID'
    }
  })

  return { success: true, order: updated }
})
