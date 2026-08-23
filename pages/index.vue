<template>
  <div class="min-h-screen bg-gray-50 font-body">

    <!-- ── Header: Logo + Countdown sesi aktif ── -->
    <div class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto">
      <div class="flex items-center gap-2">
        <div class="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="font-black text-red-600 tracking-tight text-lg">BAZARIN<span class="text-gray-900">AJA</span></span>
      </div>

      <div v-if="selectedSession" class="flex items-center gap-2 text-sm">
        <svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        <span class="text-gray-500 font-medium">{{ selectedSession.isRunning ? 'BERAKHIR DALAM' : 'DIMULAI DALAM' }}</span>
        <span class="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-sm">{{ sessionCountdown }}</span>
      </div>
    </div>

    <!-- ── Banner ── -->
    <div class="bg-red-600 py-8 px-4 text-center">
      <div class="flex items-center justify-center gap-3 mb-2">
        <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight">
          <span class="text-brand-400">FLASH</span> SALE
        </h1>
      </div>
      <p class="text-white/70 text-sm">Harga terbaik, stok terbatas!</p>
    </div>

    <!-- ── Session Tabs ── -->
    <div class="bg-gray-950 px-4">
      <div class="max-w-5xl mx-auto flex w-full">
        <button
          v-if="!sessions?.length"
          class="px-6 py-4 text-gray-400 text-sm"
        >
          Tidak ada sesi aktif
        </button>

        <button
          v-for="session in sessions"
          :key="session.id"
          class="flex-1 flex flex-col items-center px-2 py-3.5 border-b-2 text-sm font-semibold transition-colors"
          :class="selectedSessionId === session.id
            ? 'border-brand-400 text-brand-400'
            : 'border-transparent text-gray-400 hover:text-gray-200'"
          @click="selectSession(session.id)"
        >
          <span class="text-2xl font-bold font-mono">{{ formatTime(session.startTime) }}</span>
          <span class="text-xs font-normal mt-0.5">
            <template v-if="session.isRunning">
              <span class="text-brand-400 font-semibold">● Sedang Berjalan</span>
            </template>
            <template v-else>
              {{ sessionDayLabel(session.startTime) }}
            </template>
          </span>
        </button>
      </div>
    </div>

    <!-- ── Produk ── -->
    <div class="max-w-5xl mx-auto px-4 py-8">
      <!-- Info sesi yang dipilih -->
      <div v-if="selectedSession" class="flex items-center gap-3 mb-6">
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ selectedSession.title }}</h2>
          <p class="text-sm text-gray-500">
            {{ formatDateTime(selectedSession.startTime) }} – {{ formatTime(selectedSession.endTime) }}
            <span v-if="selectedSession.isRunning" class="ml-2 text-brand-600 font-semibold">● Sedang Berlangsung</span>
          </p>
        </div>
      </div>

      <div v-if="productsPending" class="flex justify-center py-20">
        <div class="animate-spin h-8 w-8 rounded-full border-2 border-brand-400 border-t-transparent"></div>
      </div>
      <div v-else-if="!products?.length" class="text-center py-20">
        <p class="text-gray-400 text-sm">Belum ada produk di sesi ini</p>
      </div>
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
          :flash-active="!!(selectedSession?.isRunning)"
          :masked-phone="soldPhones[product.id]"
          @buy="openCheckout"
          @detail="openDetail"
        />
      </div>
    </div>

    <!-- ── Detail Modal ── -->
    <div v-if="showDetailModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showDetailModal = false" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">

        <!-- Galeri foto -->
        <div class="relative bg-gray-100 shrink-0">
          <img
            :src="detailGallery[detailActiveImg] ?? detailProduct?.imageUrl"
            :alt="detailProduct?.title"
            class="w-full h-60 object-cover"
          />
          <!-- Navigasi panah -->
          <template v-if="detailGallery.length > 1">
            <button
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
              @click="detailActiveImg = (detailActiveImg - 1 + detailGallery.length) % detailGallery.length"
            >‹</button>
            <button
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
              @click="detailActiveImg = (detailActiveImg + 1) % detailGallery.length"
            >›</button>
            <!-- Dot indicator -->
            <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button
                v-for="(_, i) in detailGallery" :key="i"
                class="w-1.5 h-1.5 rounded-full transition-colors"
                :class="i === detailActiveImg ? 'bg-white' : 'bg-white/40'"
                @click="detailActiveImg = i"
              />
            </div>
          </template>
        </div>

        <!-- Thumbnail strip -->
        <div v-if="detailGallery.length > 1" class="flex gap-2 px-4 pt-3 overflow-x-auto shrink-0">
          <button
            v-for="(img, i) in detailGallery" :key="i"
            class="shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors"
            :class="i === detailActiveImg ? 'border-brand-400' : 'border-transparent'"
            @click="detailActiveImg = i"
          >
            <img :src="img" class="w-full h-full object-cover" />
          </button>
        </div>

        <!-- Info -->
        <div class="p-5 overflow-y-auto flex-1">
          <h2 class="text-lg font-bold text-gray-900 mb-0.5">{{ detailProduct?.title }}</h2>
          <p class="text-brand-600 font-bold text-xl mb-3">Rp {{ formatPrice(detailProduct?.price) }}</p>
          <p v-if="detailProduct?.description" class="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">{{ detailProduct.description }}</p>
          <div class="flex gap-3">
            <button class="btn-secondary-full" @click="showDetailModal = false">Tutup</button>
            <button
              v-if="selectedSession?.isRunning && detailProduct?.status === 'AVAILABLE'"
              class="btn-primary-full"
              @click="() => { showDetailModal = false; openCheckout(detailProduct!) }"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Checkout Modal ── -->
    <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6">
      <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]" @click="showModal = false" />
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div class="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl mb-5">
          <img :src="selectedProduct?.imageUrl" :alt="selectedProduct?.title" class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-brand-300" />
          <div class="min-w-0">
            <p class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{{ selectedProduct?.title }}</p>
            <p class="text-brand-600 font-bold mt-0.5">Rp {{ formatPrice(selectedProduct?.price) }}</p>
          </div>
        </div>
        <h2 class="text-lg font-bold text-gray-900 mb-4">Data Pembeli</h2>
        <form class="space-y-4" @submit.prevent="submitCheckout">
          <div>
            <label class="label-text">Nama Lengkap <span class="text-error-600">*</span></label>
            <input v-model="form.buyerName" type="text" placeholder="Masukkan nama lengkap" class="input-field" required />
          </div>
          <div>
            <label class="label-text">Nomor HP / WhatsApp <span class="text-error-600">*</span></label>
            <input v-model="form.buyerPhone" type="tel" placeholder="08xx atau 628xx" class="input-field" required />
            <p class="text-xs text-gray-400 mt-1">Format: 08xxxxxx atau 628xxxxxx</p>
          </div>
          <div class="flex gap-3 pt-2">
            <button type="button" class="btn-secondary-full" @click="showModal = false">Batal</button>
            <button type="submit" class="btn-primary-full" :disabled="submitting">
              <span v-if="submitting" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
              <span v-else>Beli Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ── Toast ── -->
    <div v-if="toast.visible" class="fixed bottom-6 left-1/2 -translate-x-0.5 z-[60] w-full max-w-sm px-4">
      <div
        class="rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm font-medium"
        :class="toast.type === 'success' ? 'bg-success-50 border border-success-500/30 text-success-700' : 'bg-error-50 border border-error-100 text-error-600'"
      >
        <span>{{ toast.type === 'success' ? '✓' : '✕' }}</span>
        <div>
          <p class="font-semibold">{{ toast.title }}</p>
          <p v-if="toast.description" class="text-xs opacity-80 mt-0.5">{{ toast.description }}</p>
        </div>
      </div>
    </div>
  </div>

  <!-- ── Banner Otomatisin ── -->
  <section
    class="relative overflow-hidden py-10 px-6 text-center"
    style="background-image: url('/otomatisinwebid.png'); background-size: cover; background-position: center;"
  >
    <div class="absolute inset-0 bg-black/65"></div>
    <div class="relative z-10 max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-5">
      <p class="text-white font-bold text-base sm:text-lg leading-snug">
        Punya ide bisnis digital tapi terkendala biaya IT?<br>
        <span class="text-yellow-400">Mulai Bangun Produk Digitalmu Gratis Bersama Otomatisin!</span>
      </p>
      <a
        href="https://otomatisin.web.id"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg"
      >
        Konsultasi Gratis →
      </a>
    </div>
  </section>

  <footer class="text-center py-6 text-xs text-gray-400">
    Powered by <a href="https://otomatisin.web.id" target="_blank" rel="noopener noreferrer" class="text-gray-500 hover:text-gray-700 underline underline-offset-2">Otomatisin</a>
  </footer>
</template>

<script setup lang="ts">
interface Session {
  id: string
  title: string
  startTime: string
  endTime: string
  isActive: boolean
  isRunning: boolean
  _count: { products: number }
}
interface Product {
  id: string
  title: string
  description?: string | null
  price: number | string
  imageUrl: string
  images: string[]
  status: 'AVAILABLE' | 'SOLD_OUT'
  sessionId: string | null
}

// Semua sesi untuk tabs
const { data: sessions, refresh: refreshSessions } = await useFetch<Session[]>('/api/flash-sale/config')

// Default pilih sesi yang sedang berjalan, kalau tidak ada pilih yang pertama
const selectedSessionId = ref<string | null>(null)

watchEffect(() => {
  if (!sessions.value?.length || selectedSessionId.value) return
  const running = sessions.value.find(s => s.isRunning)
  selectedSessionId.value = running?.id ?? sessions.value[0]?.id ?? null
})

const selectedSession = computed(() => sessions.value?.find(s => s.id === selectedSessionId.value) ?? null)
const runningSession = computed(() => sessions.value?.find(s => s.isRunning) ?? null)

function selectSession(id: string) {
  selectedSessionId.value = id
}

// Produk per sesi
const { data: products, pending: productsPending, refresh: refreshProducts } = await useFetch<Product[]>(
  () => selectedSessionId.value ? `/api/products?sessionId=${selectedSessionId.value}` : '/api/products',
  { watch: [selectedSessionId] }
)

const availableCount = computed(() => products.value?.filter(p => p.status === 'AVAILABLE').length ?? 0)

// Countdown global ke sesi yang running
const now = ref(Date.now())
onMounted(() => {
  const tick = setInterval(() => {
    now.value = Date.now()
    if (now.value % 60000 < 1000) refreshSessions()
  }, 1000)

  // Polling status produk — hanya saat sesi sedang berjalan
  const poll = setInterval(async () => {
    if (!selectedSession.value?.isRunning || !selectedSessionId.value) return
    try {
      const statuses = await $fetch<{ id: string; status: 'AVAILABLE' | 'SOLD_OUT' }[]>(
        `/api/products/status?sessionId=${selectedSessionId.value}`
      )
      if (!products.value) return
      for (const s of statuses) {
        const p = products.value.find(p => p.id === s.id)
        if (p && p.status !== s.status) p.status = s.status
      }
    } catch {}
  }, 5000)

  onUnmounted(() => { clearInterval(tick); clearInterval(poll) })
})

const sessionCountdown = computed(() => {
  const s = selectedSession.value
  if (!s) return ''
  const target = s.isRunning ? new Date(s.endTime).getTime() : new Date(s.startTime).getTime()
  const diff = Math.max(0, target - now.value)
  const h = Math.floor(diff / 3600000).toString().padStart(2, '0')
  const m = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0')
  const sec = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0')
  return `${h}:${m}:${sec}`
})

// Helpers
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
}
function formatPrice(price?: number | string) {
  return Number(price || 0).toLocaleString('id-ID')
}
function sessionDayLabel(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (d.toDateString() === today.toDateString()) return 'Hari ini'
  if (d.toDateString() === tomorrow.toDateString()) return 'Besok'
  return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
}

// Detail
const showDetailModal = ref(false)
const detailProduct = ref<Product | null>(null)
const detailActiveImg = ref(0)
const detailGallery = computed(() => {
  if (!detailProduct.value) return []
  return [detailProduct.value.imageUrl, ...(detailProduct.value.images ?? [])].filter(Boolean)
})

function openDetail(product: Product) {
  detailProduct.value = product
  detailActiveImg.value = 0
  showDetailModal.value = true
}

// Checkout
const showModal = ref(false)
const submitting = ref(false)
const selectedProduct = ref<Product | null>(null)
const form = reactive({ buyerName: '', buyerPhone: '' })
const soldPhones = ref<Record<string, string>>({})

function maskPhone(phone: string) {
  return phone.length > 3 ? phone.slice(0, -3) + 'xxx' : 'xxx'
}
const toast = reactive({ visible: false, type: 'success', title: '', description: '' })
let toastTimer: ReturnType<typeof setTimeout>

function showToast(type: 'success' | 'error', title: string, description = '') {
  clearTimeout(toastTimer)
  Object.assign(toast, { visible: true, type, title, description })
  toastTimer = setTimeout(() => { toast.visible = false }, 4000)
}

function openCheckout(product: Product) {
  selectedProduct.value = product
  form.buyerName = ''
  form.buyerPhone = ''
  showModal.value = true
}

async function submitCheckout() {
  if (!selectedProduct.value) return
  submitting.value = true
  try {
    const productId = selectedProduct.value.id
    const phone = form.buyerPhone
    await $fetch('/api/checkout', {
      method: 'POST',
      body: { productId, buyerName: form.buyerName, buyerPhone: phone }
    })
    showModal.value = false
    // optimistic update
    soldPhones.value[productId] = maskPhone(phone)
    if (products.value) {
      const p = products.value.find(p => p.id === productId)
      if (p) p.status = 'SOLD_OUT'
    }
    showToast('success', 'Pesanan berhasil!', 'Admin akan segera menghubungi Anda via WhatsApp')
  } catch (err: any) {
    showToast('error', 'Gagal melakukan pembelian', err.data?.statusMessage)
  } finally {
    submitting.value = false
  }
}
</script>
