import { defineComponent, withAsyncContext, ref, watchEffect, computed, reactive, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useFetch } from './fetch-CSYyKZ5q.mjs';
import '../nitro/nitro.mjs';
import '@prisma/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'node:module';
import '@vue/shared';
import './ssr-Bqnw2a-w.mjs';
import './server.mjs';
import 'vue-router';
import '@vueuse/core';
import 'tailwind-merge';
import '@iconify/vue';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import './asyncData-V5-Y7oHb.mjs';
import 'perfect-debounce';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProductCard",
  __ssrInlineRender: true,
  props: {
    product: {},
    flashActive: { type: Boolean },
    maskedPhone: {}
  },
  emits: ["buy", "detail"],
  setup(__props) {
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card overflow-hidden flex flex-col transition-shadow hover:shadow-md" }, _attrs))}><div class="relative aspect-square bg-gray-100 overflow-hidden"><img${ssrRenderAttr("src", __props.product.imageUrl)}${ssrRenderAttr("alt", __props.product.title)} class="w-full h-full object-cover transition-transform duration-300 hover:scale-105">`);
      if (__props.product.status === "SOLD_OUT") {
        _push(`<div class="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center gap-1.5"><span class="text-white font-bold text-sm tracking-widest uppercase bg-red-600 px-3 py-1 rounded-full"> Sold Out </span>`);
        if (__props.maskedPhone) {
          _push(`<span class="text-white/80 text-xs font-mono bg-black/40 px-2 py-0.5 rounded">${ssrInterpolate(__props.maskedPhone)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="p-3 flex flex-col gap-2 flex-1"><p class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">${ssrInterpolate(__props.product.title)}</p><p class="text-brand-600 font-bold text-base">Rp ${ssrInterpolate(formatPrice(__props.product.price))}</p><div class="flex gap-2 mt-auto"><button class="btn-secondary-full"> Detail </button>`);
      if (__props.flashActive && __props.product.status === "AVAILABLE") {
        _push(`<button class="btn-primary-full"> Beli </button>`);
      } else if (__props.flashActive && __props.product.status === "SOLD_OUT") {
        _push(`<button class="btn-secondary-full" disabled> Sold Out </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ProductCard.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: sessions, refresh: refreshSessions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/flash-sale/config",
      "$_jTFd6W4CA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const selectedSessionId = ref(null);
    watchEffect(() => {
      var _a, _b, _c, _d;
      if (!((_a = sessions.value) == null ? void 0 : _a.length) || selectedSessionId.value) return;
      const running = sessions.value.find((s) => s.isRunning);
      selectedSessionId.value = (_d = (_c = running == null ? void 0 : running.id) != null ? _c : (_b = sessions.value[0]) == null ? void 0 : _b.id) != null ? _d : null;
    });
    const selectedSession = computed(() => {
      var _a, _b;
      return (_b = (_a = sessions.value) == null ? void 0 : _a.find((s) => s.id === selectedSessionId.value)) != null ? _b : null;
    });
    computed(() => {
      var _a, _b;
      return (_b = (_a = sessions.value) == null ? void 0 : _a.find((s) => s.isRunning)) != null ? _b : null;
    });
    const { data: products, pending: productsPending, refresh: refreshProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      () => selectedSessionId.value ? `/api/products?sessionId=${selectedSessionId.value}` : "/api/products",
      { watch: [selectedSessionId] },
      "$k2JovHEzCE"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    computed(() => {
      var _a, _b;
      return (_b = (_a = products.value) == null ? void 0 : _a.filter((p) => p.status === "AVAILABLE").length) != null ? _b : 0;
    });
    const now = ref(Date.now());
    const sessionCountdown = computed(() => {
      const s = selectedSession.value;
      if (!s) return "";
      const target = s.isRunning ? new Date(s.endTime).getTime() : new Date(s.startTime).getTime();
      const diff = Math.max(0, target - now.value);
      const h = Math.floor(diff / 36e5).toString().padStart(2, "0");
      const m = Math.floor(diff % 36e5 / 6e4).toString().padStart(2, "0");
      const sec = Math.floor(diff % 6e4 / 1e3).toString().padStart(2, "0");
      return `${h}:${m}:${sec}`;
    });
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatDateTime(iso) {
      return new Date(iso).toLocaleString("id-ID", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatPrice(price) {
      return Number(price || 0).toLocaleString("id-ID");
    }
    function sessionDayLabel(iso) {
      const d = new Date(iso);
      const today = /* @__PURE__ */ new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (d.toDateString() === today.toDateString()) return "Hari ini";
      if (d.toDateString() === tomorrow.toDateString()) return "Besok";
      return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
    }
    const showDetailModal = ref(false);
    const detailProduct = ref(null);
    const detailActiveImg = ref(0);
    const detailGallery = computed(() => {
      var _a;
      if (!detailProduct.value) return [];
      return [detailProduct.value.imageUrl, ...(_a = detailProduct.value.images) != null ? _a : []].filter(Boolean);
    });
    function openDetail(product) {
      detailProduct.value = product;
      detailActiveImg.value = 0;
      showDetailModal.value = true;
    }
    const showModal = ref(false);
    const submitting = ref(false);
    const selectedProduct = ref(null);
    const form = reactive({ buyerName: "", buyerPhone: "" });
    const soldPhones = ref({});
    const toast = reactive({ visible: false, type: "success", title: "", description: "" });
    function openCheckout(product) {
      selectedProduct.value = product;
      form.buyerName = "";
      form.buyerPhone = "";
      showModal.value = true;
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
      const _component_ProductCard = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-body" }, _attrs))}><div class="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-5xl mx-auto"><div class="flex items-center gap-2"><div class="w-7 h-7 bg-red-600 rounded-lg flex items-center justify-center"><svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="font-black text-red-600 tracking-tight text-lg">BAZARIN<span class="text-gray-900">AJA</span></span></div>`);
      if (unref(selectedSession)) {
        _push(`<div class="flex items-center gap-2 text-sm"><svg class="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg><span class="text-gray-500 font-medium">${ssrInterpolate(unref(selectedSession).isRunning ? "BERAKHIR DALAM" : "DIMULAI DALAM")}</span><span class="font-mono font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg text-sm">${ssrInterpolate(unref(sessionCountdown))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="bg-red-600 py-8 px-4 text-center"><div class="flex items-center justify-center gap-3 mb-2"><div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center"><svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight"><span class="text-brand-400">FLASH</span> SALE </h1></div><p class="text-white/70 text-sm">Harga terbaik, stok terbatas!</p></div><div class="bg-gray-950 px-4"><div class="max-w-5xl mx-auto flex w-full">`);
      if (!((_a = unref(sessions)) == null ? void 0 : _a.length)) {
        _push(`<button class="px-6 py-4 text-gray-400 text-sm"> Tidak ada sesi aktif </button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--[-->`);
      ssrRenderList(unref(sessions), (session) => {
        _push(`<button class="${ssrRenderClass([unref(selectedSessionId) === session.id ? "border-brand-400 text-brand-400" : "border-transparent text-gray-400 hover:text-gray-200", "flex-1 flex flex-col items-center px-2 py-3.5 border-b-2 text-sm font-semibold transition-colors"])}"><span class="text-2xl font-bold font-mono">${ssrInterpolate(formatTime(session.startTime))}</span><span class="text-xs font-normal mt-0.5">`);
        if (session.isRunning) {
          _push(`<span class="text-brand-400 font-semibold">\u25CF Sedang Berjalan</span>`);
        } else {
          _push(`<!--[-->${ssrInterpolate(sessionDayLabel(session.startTime))}<!--]-->`);
        }
        _push(`</span></button>`);
      });
      _push(`<!--]--></div></div><div class="max-w-5xl mx-auto px-4 py-8">`);
      if (unref(selectedSession)) {
        _push(`<div class="flex items-center gap-3 mb-6"><div><h2 class="text-lg font-bold text-gray-900">${ssrInterpolate(unref(selectedSession).title)}</h2><p class="text-sm text-gray-500">${ssrInterpolate(formatDateTime(unref(selectedSession).startTime))} \u2013 ${ssrInterpolate(formatTime(unref(selectedSession).endTime))} `);
        if (unref(selectedSession).isRunning) {
          _push(`<span class="ml-2 text-brand-600 font-semibold">\u25CF Sedang Berlangsung</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</p></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(productsPending)) {
        _push(`<div class="flex justify-center py-20"><div class="animate-spin h-8 w-8 rounded-full border-2 border-brand-400 border-t-transparent"></div></div>`);
      } else if (!((_b = unref(products)) == null ? void 0 : _b.length)) {
        _push(`<div class="text-center py-20"><p class="text-gray-400 text-sm">Belum ada produk di sesi ini</p></div>`);
      } else {
        _push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"><!--[-->`);
        ssrRenderList(unref(products), (product) => {
          var _a2;
          _push(ssrRenderComponent(_component_ProductCard, {
            key: product.id,
            product,
            "flash-active": !!((_a2 = unref(selectedSession)) == null ? void 0 : _a2.isRunning),
            "masked-phone": unref(soldPhones)[product.id],
            onBuy: openCheckout,
            onDetail: openDetail
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
      if (unref(showDetailModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col"><div class="relative bg-gray-100 shrink-0"><img${ssrRenderAttr("src", (_d = unref(detailGallery)[unref(detailActiveImg)]) != null ? _d : (_c = unref(detailProduct)) == null ? void 0 : _c.imageUrl)}${ssrRenderAttr("alt", (_e = unref(detailProduct)) == null ? void 0 : _e.title)} class="w-full h-60 object-cover">`);
        if (unref(detailGallery).length > 1) {
          _push(`<!--[--><button class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center">\u2039</button><button class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center">\u203A</button><div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5"><!--[-->`);
          ssrRenderList(unref(detailGallery), (_, i) => {
            _push(`<button class="${ssrRenderClass([i === unref(detailActiveImg) ? "bg-white" : "bg-white/40", "w-1.5 h-1.5 rounded-full transition-colors"])}"></button>`);
          });
          _push(`<!--]--></div><!--]-->`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
        if (unref(detailGallery).length > 1) {
          _push(`<div class="flex gap-2 px-4 pt-3 overflow-x-auto shrink-0"><!--[-->`);
          ssrRenderList(unref(detailGallery), (img, i) => {
            _push(`<button class="${ssrRenderClass([i === unref(detailActiveImg) ? "border-brand-400" : "border-transparent", "shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-colors"])}"><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover"></button>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="p-5 overflow-y-auto flex-1"><h2 class="text-lg font-bold text-gray-900 mb-0.5">${ssrInterpolate((_f = unref(detailProduct)) == null ? void 0 : _f.title)}</h2><p class="text-brand-600 font-bold text-xl mb-3">Rp ${ssrInterpolate(formatPrice((_g = unref(detailProduct)) == null ? void 0 : _g.price))}</p>`);
        if ((_h = unref(detailProduct)) == null ? void 0 : _h.description) {
          _push(`<p class="text-sm text-gray-600 leading-relaxed mb-4 whitespace-pre-line">${ssrInterpolate(unref(detailProduct).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-3"><button class="btn-secondary-full">Tutup</button>`);
        if (((_i = unref(selectedSession)) == null ? void 0 : _i.isRunning) && ((_j = unref(detailProduct)) == null ? void 0 : _j.status) === "AVAILABLE") {
          _push(`<button class="btn-primary-full"> Beli Sekarang </button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"><div class="flex items-center gap-3 p-3 bg-brand-50 border border-brand-200 rounded-xl mb-5"><img${ssrRenderAttr("src", (_k = unref(selectedProduct)) == null ? void 0 : _k.imageUrl)}${ssrRenderAttr("alt", (_l = unref(selectedProduct)) == null ? void 0 : _l.title)} class="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover shrink-0 border border-brand-300"><div class="min-w-0"><p class="font-semibold text-gray-900 text-sm leading-tight line-clamp-2">${ssrInterpolate((_m = unref(selectedProduct)) == null ? void 0 : _m.title)}</p><p class="text-brand-600 font-bold mt-0.5">Rp ${ssrInterpolate(formatPrice((_n = unref(selectedProduct)) == null ? void 0 : _n.price))}</p></div></div><h2 class="text-lg font-bold text-gray-900 mb-4">Data Pembeli</h2><form class="space-y-4"><div><label class="label-text">Nama Lengkap <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(form).buyerName)} type="text" placeholder="Masukkan nama lengkap" class="input-field" required></div><div><label class="label-text">Nomor HP / WhatsApp <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(form).buyerPhone)} type="tel" placeholder="08xx atau 628xx" class="input-field" required><p class="text-xs text-gray-400 mt-1">Format: 08xxxxxx atau 628xxxxxx</p></div><div class="flex gap-3 pt-2"><button type="button" class="btn-secondary-full">Batal</button><button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(submitting)) ? " disabled" : ""}>`);
        if (unref(submitting)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Beli Sekarang</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(toast).visible) {
        _push(`<div class="fixed bottom-6 left-1/2 -translate-x-0.5 z-[60] w-full max-w-sm px-4"><div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-success-50 border border-success-500/30 text-success-700" : "bg-error-50 border border-error-100 text-error-600", "rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm font-medium"])}"><span>${ssrInterpolate(unref(toast).type === "success" ? "\u2713" : "\u2715")}</span><div><p class="font-semibold">${ssrInterpolate(unref(toast).title)}</p>`);
        if (unref(toast).description) {
          _push(`<p class="text-xs opacity-80 mt-0.5">${ssrInterpolate(unref(toast).description)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-DN4KNgw9.mjs.map
