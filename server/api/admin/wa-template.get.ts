const DEFAULTS: Record<string, string> = {
  single: `Halo {{name}},

Terima kasih telah memesan produk *{{product}}* seharga *Rp {{price}}* dalam program Flash Sale!

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`,

  bulk: `Halo {{name}},

Terima kasih telah memesan dalam program Flash Sale!

Berikut pesanan Anda:
{{items}}

*Total: Rp {{total}}*

Silakan lakukan pembayaran ke rekening berikut:
{{bank_info}}

Setelah transfer, kirimkan bukti pembayaran ke admin. Terima kasih!`
}

export default defineEventHandler(async (event) => {
  requireAdminSession(event)

  const rows = await prisma.waTemplate.findMany()
  const result: Record<string, string> = { ...DEFAULTS }
  for (const row of rows) {
    result[row.key] = row.template
  }
  return result
})
