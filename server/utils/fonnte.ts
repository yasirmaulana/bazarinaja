const DEFAULT_SINGLE = `Halo {{name}},

Terima kasih telah memesan produk *{{product}}* seharga *Rp {{price}}* dalam program Flash Sale!

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`

async function getTemplate(key: string, fallback: string): Promise<string> {
  const row = await prisma.waTemplate.findUnique({ where: { key } })
  return row?.template ?? fallback
}

export async function sendPaymentNotice(
  targetPhone: string,
  buyerName: string,
  productTitle: string,
  price: number
) {
  const config = useRuntimeConfig()
  const template = await getTemplate('single', DEFAULT_SINGLE)

  const message = template
    .replace(/{{name}}/g, buyerName)
    .replace(/{{product}}/g, productTitle)
    .replace(/{{price}}/g, price.toLocaleString('id-ID'))
    .replace(/{{bank_info}}/g, config.bankInfo || 'Bank BCA: 1234567890 a.n. Toko Flash Sale')

  return await $fetch(config.fonnteUrl || 'https://api.fonnte.com/send', {
    method: 'POST',
    headers: { Authorization: config.fonnteToken },
    body: { target: targetPhone, message }
  })
}

export async function getBulkTemplate(): Promise<string> {
  const DEFAULT_BULK = `Halo {{name}},

Terima kasih telah memesan dalam program Flash Sale!

Berikut pesanan Anda:
{{items}}

*Total: Rp {{total}}*

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`

  return getTemplate('bulk', DEFAULT_BULK)
}
