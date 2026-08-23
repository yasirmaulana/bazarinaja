export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  if (!formData) throw createError({ statusCode: 400, statusMessage: 'Form data kosong' })

  const fields: Record<string, string> = {}
  let imageUrl = ''
  const extraImages: string[] = []

  for (const part of formData) {
    if (part.name === 'image' && part.filename) {
      imageUrl = await uploadToS3(part.data, part.filename, part.type || 'image/jpeg')
    } else if (part.name === 'images' && part.filename) {
      const url = await uploadToS3(part.data, part.filename, part.type || 'image/jpeg')
      extraImages.push(url)
    } else if (part.name) {
      fields[part.name] = part.data.toString()
    }
  }

  if (!fields.title || !fields.price) {
    throw createError({ statusCode: 400, statusMessage: 'title dan price wajib diisi' })
  }

  const sessionId = fields.sessionId && fields.sessionId !== '' ? fields.sessionId : null
  const description = fields.description || null

  if (fields.id) {
    const existing = await prisma.product.findUnique({ where: { id: fields.id }, select: { images: true } })
    return await prisma.product.update({
      where: { id: fields.id },
      data: {
        title: fields.title,
        price: parseFloat(fields.price),
        description,
        sessionId,
        ...(imageUrl && { imageUrl }),
        images: extraImages.length > 0 ? [...(existing?.images ?? []), ...extraImages] : undefined
      }
    })
  }

  if (!imageUrl) throw createError({ statusCode: 400, statusMessage: 'Foto produk wajib diupload' })

  return await prisma.product.create({
    data: {
      title: fields.title,
      price: parseFloat(fields.price),
      description,
      imageUrl,
      images: extraImages,
      sessionId,
      status: 'AVAILABLE'
    }
  })
})
