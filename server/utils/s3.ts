import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const MAX_SIZE = 2 * 1024 * 1024 // 2 MB

export function getS3Client() {
  const config = useRuntimeConfig()
  return new S3Client({
    region: config.s3Region,
    endpoint: config.s3Endpoint,
    credentials: {
      accessKeyId: config.s3AccessKey,
      secretAccessKey: config.s3SecretKey
    },
    forcePathStyle: true
  })
}

export async function uploadToS3(data: Buffer, filename: string, contentType: string): Promise<string> {
  if (data.length > MAX_SIZE) {
    throw createError({ statusCode: 400, statusMessage: `Ukuran file terlalu besar. Maksimal 2 MB (saat ini ${(data.length / 1024 / 1024).toFixed(1)} MB)` })
  }

  const config = useRuntimeConfig()
  const client = getS3Client()
  const key = `products/${Date.now()}-${filename}`

  await client.send(new PutObjectCommand({
    Bucket: config.s3Bucket,
    Key: key,
    Body: data,
    ContentType: contentType
  }))

  // Return proxy URL — bucket tidak public, gambar diakses via /api/s3-image/
  return `/api/s3-image/${key}`
}
