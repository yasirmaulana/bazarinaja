<template>
  <div class="card overflow-hidden flex flex-col transition-shadow hover:shadow-md">
    <!-- Image -->
    <div class="relative aspect-square bg-gray-100 overflow-hidden">
      <img
        :src="product.imageUrl"
        :alt="product.title"
        class="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        @error="(e) => ((e.target as HTMLImageElement).src = '/placeholder.svg')"
      />
      <div
        v-if="product.status === 'SOLD_OUT'"
        class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5"
      >
        <span class="text-white font-bold text-sm tracking-widest uppercase bg-red-600 px-3 py-1 rounded-full">
          Sold Out
        </span>
        <span v-if="maskedPhone" class="text-white/80 text-xs font-mono bg-black/40 px-2 py-0.5 rounded">
          {{ maskedPhone }}
        </span>
      </div>
    </div>

    <!-- Info -->
    <div class="p-3 flex flex-col gap-2 flex-1">
      <p class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">{{ product.title }}</p>
      <p class="text-brand-600 font-bold text-base">Rp {{ formatPrice(product.price) }}</p>

      <div class="flex gap-2 mt-auto">
        <button class="btn-secondary-full" @click="$emit('detail', product)">
          Detail
        </button>
        <button
          v-if="flashActive && product.status === 'AVAILABLE'"
          class="btn-primary-full"
          @click="$emit('buy', product)"
        >
          Beli
        </button>
        <button
          v-else-if="flashActive && product.status === 'SOLD_OUT'"
          class="btn-secondary-full"
          disabled
        >
          Sold Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  product: { id: string; title: string; price: number | string; imageUrl: string; status: 'AVAILABLE' | 'SOLD_OUT' }
  flashActive: boolean
  maskedPhone?: string
}>()

defineEmits<{ buy: [product: any]; detail: [product: any] }>()

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('id-ID')
}
</script>
