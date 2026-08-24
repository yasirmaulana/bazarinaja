<template>
  <div class="min-h-screen bg-gray-50 font-body flex items-center justify-center px-4 py-16">
    <div class="w-full max-w-sm">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-14 h-14 bg-brand-400 rounded-2xl shadow-xs mb-4">
          <svg class="w-7 h-7" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold text-gray-900 tracking-tight">Flash Sale Admin</h1>
        <p class="text-sm text-gray-500 mt-1">Masuk ke dashboard pengelolaan</p>
      </div>

      <div class="card p-6 shadow-lg">
        <form class="space-y-4" @submit.prevent="login">
          <div>
            <label class="label-text">Username</label>
            <input
              v-model="form.username"
              type="text"
              placeholder="Masukkan username"
              class="input-field"
              autocomplete="username"
              required
            />
          </div>
          <div>
            <label class="label-text">Password</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              class="input-field"
              autocomplete="current-password"
              required
            />
          </div>

          <div
            v-if="errorMsg"
            class="flex items-center gap-2 p-3 bg-error-50 border border-error-100 rounded-xl text-sm text-error-600"
          >
            <span>✕</span> {{ errorMsg }}
          </div>

          <button type="submit" class="btn-primary-full" :disabled="loading">
            <span v-if="loading" class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>
            <span v-else>Masuk</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: [] })

const form = reactive({ username: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function login() {
  loading.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/admin/login', { method: 'POST', body: form })
    window.location.href = '/admin'
  } catch (err: any) {
    errorMsg.value = err.data?.statusMessage || 'Terjadi kesalahan, coba lagi'
  } finally {
    loading.value = false
  }
}
</script>
