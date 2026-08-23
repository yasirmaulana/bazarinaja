# Product Requirement Document (PRD): Web Aplikasi Flash Sale Sederhana

## 1. Ringkasan Produk
Aplikasi web Flash Sale sederhana yang menghubungkan Pembeli (Buyer) dan Admin. Sistem ini dirancang untuk memproses pembelian produk secara cepat saat periode *flash sale* aktif, mengunci dan mengubah status stok produk secara instan saat terjadi checkout, serta mengelola konfirmasi penagihan dan verifikasi pembayaran secara semi-otomatis menggunakan integrasi WhatsApp via **Fonnte API**.

---

## 2. Tech Stack & Arsitektur Sistem

- **Frontend & Backend (Fullstack):** Nuxt 3 (Vue 3, Nitro Engine Server Routes)
- **Database:** PostgreSQL
- **ORM / Query Builder:** Prisma ORM / Drizzle ORM
- **UI Framework & Styling:** Tailwind CSS + Nuxt UI / Headless UI
- **WhatsApp Gateway:** Fonnte API (`https://api.fonnte.com`)
- **Storage Bukti Transfer:** Local Disk Storage (`public/uploads`) atau Object Storage (S3/Cloudinary)

---

## 3. Modul & User Persona (POV)

### A. Point of View (POV) Pembeli / Public Frontend
1. **Halaman Utama (Etalase Flash Sale):**
   - **Flash Sale Banner & Countdown Timer:** Menampilkan durasi waktu tersisa dari sesi Flash Sale.
   - **Katalog Produk:** Menampilkan daftar produk dengan detail:
     - Foto Produk
     - Nama Produk
     - Harga Produk
     - Status (*Tersedia* / *Sold Out*)
2. **Alur Checkout / Pembelian:**
   - Pembeli memilih produk yang diinginkan (*status Tersedia*).
   - Menampilkan Modal Pop-up Inputan:
     - **Nama Pembeli** (Required)
     - **Nomor HP / WhatsApp** (Required, validasi format nomor Indonesia)
   - Pembeli menekan tombol **"Beli Sekarang"**.
   - **Real-Time UI Update:** Begitu transaksi diproses, status produk pada etalase secara instan berubah menjadi **"Sold Out"**.

### B. Point of View (POV) Admin / Dashboard Backend
1. **Manajemen Produk & Sesi Flash Sale:**
   - Tambah, ubah, dan hapus data produk (Nama, Harga, Foto).
   - Pengaturan Sesi Flash Sale: Mengatur *Start Time* dan *End Time*.
   - Penanganan Otomatis / Manual untuk produk yang belum terjual hingga waktu *Flash Sale* berakhir.
2. **Dashboard Pesanan & Status Produk:**
   - Menampilkan tabel pesanan lengkap dengan rincian:
     - Nama Produk & Harga
     - Data Pembeli (Nama & Nomor HP)
     - Status Pesanan (*PENDING_PAYMENT*, *PAID*)
     - Status Produk (*AVAILABLE*, *SOLD_OUT*)
3. **Integrasi Penagihan & Verifikasi Pembayaran:**
   - **Tombol "Kirim Pesan WhatsApp" (Fonnte):** Admin dapat memicu pengiriman pesan WA otomatis ke nomor HP pembeli berisi rincian pesanan dan instruksi nomor rekening pembayaran.
   - **Upload Bukti Transfer:** Admin dapat mengunggah foto bukti pembayaran yang dikirimkan oleh pembeli via WA.
   - **Konfirmasi Status Paid:** Mengubah status transaksi menjadi **"Paid"** setelah bukti pembayaran diverifikasi.

---

## 4. Alur Kerja Sistem (User Flow)

```
[Pembeli] Akses Web -> Lihat Etalase & Countdown -> Pilih Produk -> Isi Nama & No HP -> Klik "Beli"
                                                                                              │
                                                                                              ▼
                                                                             [Nitro Backend API]
                                                                  Validasi & Atomic Update DB
                                                                                              │
                                                                                              ▼
[Pembeli] UI Menampilkan Toast / Notifikasi & Status Produk Berubah Jadi "Sold Out" <─── [PostgreSQL]
                                                                                              │
                                                                                              ▼
[Admin] Masuk Dashboard Pesanan -> Klik "Kirim Pesan" -> [Fonnte API] -> WhatsApp ke Pembeli
                                                                                              │
                                                                                              ▼
[Pembeli] Mengirim Bukti Transfer via WhatsApp ke Admin
                                                                                              │
                                                                                              ▼
[Admin] Upload Bukti Transfer ke System Dashboard -> Ubah Status Order menjadi "PAID"
```

---

## 5. Skema Database (Prisma Schema - PostgreSQL)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum ProductStatus {
  AVAILABLE
  SOLD_OUT
}

enum OrderStatus {
  PENDING_PAYMENT
  PAID
}

model Admin {
  id        String   @id @default(uuid())
  username  String   @unique
  password  String
  createdAt DateTime @default(now())
}

model FlashSaleConfig {
  id        String   @id @default(uuid())
  title     String   @default("Flash Sale Special")
  startTime DateTime
  endTime   DateTime
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Product {
  id        String        @id @default(uuid())
  title     String
  price     Decimal       @db.Decimal(12, 2)
  imageUrl  String
  status    ProductStatus @default(AVAILABLE)
  order     Order?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
}

model Order {
  id           String      @id @default(uuid())
  productId    String      @unique
  product      Product     @relation(fields: [productId], references: [id], onDelete: Cascade)
  buyerName    String
  buyerPhone   String
  paymentProof String?
  status       OrderStatus @default(PENDING_PAYMENT)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt
}
```

---

## 6. Spesifikasi API Routes (Nuxt Nitro Backend)

### Public Endpoints
- `GET /api/flash-sale/config`
  - Menerima konfigurasi waktu *Flash Sale* & status keaktifan.
- `GET /api/products`
  - Menerima daftar seluruh produk beserta status ketersediaannya.
- `POST /api/checkout`
  - Body: `{ productId: string, buyerName: string, buyerPhone: string }`
  - Melakukan transaksi atomik untuk mengubah status produk dari `AVAILABLE` ke `SOLD_OUT` dan membuat record `Order` baru.

### Admin Endpoints (Protected Routes)
- `POST /api/admin/products`
  - Menambahkan atau mengupdate produk baru.
- `DELETE /api/admin/products/:id`
  - Menghapus produk dari etalase.
- `POST /api/admin/flash-sale/config`
  - Mengatur jam mulai & selesai *Flash Sale*.
- `POST /api/admin/orders/:id/notify`
  - Memicu pengiriman pesan WhatsApp via Fonnte API ke pembeli.
- `POST /api/admin/orders/:id/upload-proof`
  - Mengunggah file bukti transfer dan mengubah status `Order` menjadi `PAID`.

---

## 7. Strategi Concurrency & Race Condition Handling

Untuk mencegah dua pembeli membeli produk yang sama secara bersamaan (*race condition*), proses pada endpoint `/api/checkout` wajib menggunakan **Prisma Transaction** dengan kueri perbaruan terisolasi:

```ts
// Example Nuxt Nitro Server Route (/server/api/checkout.post.ts)
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  return await prisma.$transaction(async (tx) => {
    // 1. Cek dan update status produk secara bersyarat (Atomic Update)
    const updatedProduct = await tx.product.updateMany({
      where: {
        id: body.productId,
        status: 'AVAILABLE'
      },
      data: {
        status: 'SOLD_OUT'
      }
    })

    if (updatedProduct.count === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Maaf, produk ini baru saja dibeli oleh pelanggan lain!'
      })
    }

    // 2. Buat data Order
    const order = await tx.order.create({
      data: {
        productId: body.productId,
        buyerName: body.buyerName,
        buyerPhone: body.buyerPhone,
        status: 'PENDING_PAYMENT'
      }
    })

    return { success: true, order }
  })
})
```

---

## 8. Integrasi Fonnte API (Penagihan WhatsApp)

Payload pemicu pesan WA dari backend Nitro ke Fonnte API (`https://api.fonnte.com/send`):

```ts
// Example Fonnte Dispatcher Helper
export async function sendPaymentNotice(targetPhone: string, buyerName: string, productTitle: string, price: number) {
  const config = useRuntimeConfig()
  
  const message = `Halo ${buyerName},

Terima kasih telah memesan produk *${productTitle}* seharga *Rp ${price.toLocaleString('id-ID')}* dalam program Flash Sale!

Silakan lakukan pembayaran ke rekening berikut:
Bank BCA: 1234567890 a.n. Toko Flash Sale

Setelah transfer, kirimkan bukti pembayaran balasan ke nomor WhatsApp ini. Terima kasih!`

  return await $fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: {
      Authorization: config.fonnteToken
    },
    body: {
      target: targetPhone,
      message: message
    }
  })
}
```
