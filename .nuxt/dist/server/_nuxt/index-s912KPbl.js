import { _ as __nuxt_component_0 } from "./asyncData-V5-Y7oHb.js";
import { defineComponent, ref, reactive, withAsyncContext, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderComponent, ssrIncludeBooleanAttr, ssrRenderAttr, ssrLooseContain, ssrLooseEqual } from "vue/server-renderer";
import "/home/yasir/Documents/Project/flashsale/node_modules/hookable/dist/index.mjs";
import { u as useFetch } from "./fetch-CSYyKZ5q.js";
import "../server.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/perfect-debounce/dist/index.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/ohash/dist/index.mjs";
import "@vue/shared";
import "./ssr-Bqnw2a-w.js";
import "/home/yasir/Documents/Project/flashsale/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/flashsale/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/home/yasir/Documents/Project/flashsale/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/ufo/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/flashsale/node_modules/klona/dist/index.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const activeTab = ref("dashboard");
    const tabs = [
      { key: "dashboard", label: "Dashboard" },
      { key: "orders", label: "Pesanan" },
      { key: "products", label: "Produk" },
      { key: "config", label: "Flash Sale Config" }
    ];
    const toast = reactive({ visible: false, type: "success", message: "" });
    const { data: orders, pending: ordersLoading, refresh: refreshOrders } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/orders",
      "$-EFpiWlPF6"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const notifying = ref(null);
    const cancelling = ref(null);
    const showProofModal = ref(false);
    const uploadingProof = ref(false);
    ref(null);
    ref(null);
    const selectedOrderIds = ref(/* @__PURE__ */ new Set());
    const bulkNotifying = ref(false);
    const orderSearch = ref("");
    const orderStatusFilter = ref("ALL");
    const orderStatusFilters = [
      { value: "ALL", label: "Semua" },
      { value: "PENDING_PAYMENT", label: "Menunggu" },
      { value: "PAID", label: "Lunas" },
      { value: "CANCELLED", label: "Dibatalkan" }
    ];
    const orderStatusCounts = computed(() => {
      const all = orders.value ?? [];
      const counts = { ALL: all.length, PENDING_PAYMENT: 0, PAID: 0, CANCELLED: 0 };
      for (const o of all) counts[o.status] = (counts[o.status] ?? 0) + 1;
      return counts;
    });
    const filteredOrders = computed(() => {
      const all = orders.value ?? [];
      const q = orderSearch.value.trim().toLowerCase();
      return all.filter((o) => {
        if (orderStatusFilter.value !== "ALL" && o.status !== orderStatusFilter.value) return false;
        if (!q) return true;
        return o.buyerName.toLowerCase().includes(q) || o.buyerPhone.includes(q) || o.product?.title?.toLowerCase().includes(q);
      });
    });
    const { data: products, refresh: refreshProducts } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/products",
      "$WHBsNtzflH"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const showProductModal = ref(false);
    const savingProduct = ref(false);
    const deletingProduct = ref(null);
    const editingProduct = ref(null);
    ref(null);
    const extraFiles = ref([]);
    const productForm = reactive({ title: "", price: "", sessionId: "", description: "" });
    const { data: sessions, pending: sessionsLoading, refresh: refreshSessions } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/admin/flash-sale/sessions",
      "$H5ygxiYUGA"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const deletingSession = ref(null);
    const togglingSession = ref(null);
    const nowMs = ref(Date.now());
    const sessionsSorted = computed(
      () => [...sessions.value ?? []].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
    );
    function sessionStatus(s) {
      const start = new Date(s.startTime).getTime();
      const end = new Date(s.endTime).getTime();
      if (nowMs.value >= start && nowMs.value <= end) return "active";
      if (nowMs.value < start) return "upcoming";
      return "ended";
    }
    const dashboardStats = computed(() => {
      const all = orders.value ?? [];
      const paid = all.filter((o) => o.status === "PAID");
      const pending = all.filter((o) => o.status === "PENDING_PAYMENT");
      const cancelled = all.filter((o) => o.status === "CANCELLED");
      const revenue = paid.reduce((sum, o) => sum + Number(o.product?.price || 0), 0);
      return {
        totalOrders: all.length,
        totalRevenue: revenue,
        pendingCount: pending.length,
        cancelledCount: cancelled.length
      };
    });
    computed(() => {
      const all = orders.value ?? [];
      const paid = all.filter((o) => o.status === "PAID").length;
      const pending = all.filter((o) => o.status === "PENDING_PAYMENT").length;
      const cancelled = all.filter((o) => o.status === "CANCELLED").length;
      return {
        labels: ["Lunas", "Menunggu", "Dibatalkan"],
        datasets: [{
          data: [paid, pending, cancelled],
          backgroundColor: ["#22c55e", "#f59e0b", "#9ca3af"],
          borderWidth: 0
        }]
      };
    });
    computed(() => {
      const all = orders.value ?? [];
      const map = /* @__PURE__ */ new Map();
      for (const o of all) {
        const sid = o.product?.sessionId || "Tanpa Sesi";
        const session = sessions.value?.find((s) => s.id === sid);
        const title = session?.title || sid;
        const cur = map.get(sid) || { title, count: 0 };
        cur.count++;
        map.set(sid, cur);
      }
      const items = Array.from(map.values());
      return {
        labels: items.map((i) => i.title),
        datasets: [{
          label: "Jumlah Pesanan",
          data: items.map((i) => i.count),
          backgroundColor: "#FABC3F",
          borderRadius: 6
        }]
      };
    });
    const topProducts = computed(() => {
      const all = orders.value ?? [];
      const map = /* @__PURE__ */ new Map();
      for (const o of all) {
        if (!o.product) continue;
        const cur = map.get(o.product.id) || { title: o.product.title, count: 0, revenue: 0 };
        cur.count++;
        cur.revenue += Number(o.product.price || 0);
        map.set(o.product.id, cur);
      }
      return Array.from(map.values()).sort((a, b) => b.count - a.count).slice(0, 5);
    });
    const configForm = reactive({ title: "Flash Sale Special", startTime: "", endTime: "" });
    const savingConfig = ref(false);
    function sessionLabel(sessionId) {
      const s = sessions.value?.find((s2) => s2.id === sessionId);
      if (!s) return sessionId;
      return `${s.title} · ${formatTime(s.startTime)}`;
    }
    function formatDateTime(iso) {
      return new Date(iso).toLocaleString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      });
    }
    function formatTime(iso) {
      return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false });
    }
    function formatPrice(price) {
      return Number(price).toLocaleString("id-ID");
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-body" }, _attrs))}><div class="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs"><div class="flex items-center gap-3"><div class="w-8 h-8 bg-brand-400 rounded-lg flex items-center justify-center"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><span class="font-bold text-gray-900">Flash Sale Admin</span></div><button class="btn-secondary text-sm">Keluar</button></div><div class="max-w-5xl mx-auto px-4 py-8"><div class="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6 w-fit"><!--[-->`);
      ssrRenderList(tabs, (tab) => {
        _push(`<button class="${ssrRenderClass([unref(activeTab) === tab.key ? "bg-white text-gray-900 shadow-xs" : "text-gray-500 hover:text-gray-700", "px-4 py-2 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap"])}">${ssrInterpolate(tab.label)}</button>`);
      });
      _push(`<!--]--></div>`);
      if (unref(activeTab) === "dashboard") {
        _push(`<div class="space-y-5"><div class="grid grid-cols-2 lg:grid-cols-4 gap-4"><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Total Pesanan</p><p class="text-2xl font-bold text-gray-900">${ssrInterpolate(unref(dashboardStats).totalOrders)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Total Pendapatan</p><p class="text-2xl font-bold text-green-600">Rp ${ssrInterpolate(formatPrice(unref(dashboardStats).totalRevenue))}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Menunggu Pembayaran</p><p class="text-2xl font-bold text-amber-600">${ssrInterpolate(unref(dashboardStats).pendingCount)}</p></div><div class="card p-4"><p class="text-xs text-gray-500 mb-1">Dibatalkan</p><p class="text-2xl font-bold text-gray-500">${ssrInterpolate(unref(dashboardStats).cancelledCount)}</p></div></div><div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div class="card p-4"><h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Status</h3><div class="h-56 flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent" })
              ];
            }
          })
        }, _parent));
        _push(`</div></div><div class="card p-4"><h3 class="text-sm font-bold text-gray-900 mb-4">Pesanan per Sesi</h3><div class="h-56 flex items-center justify-center">`);
        _push(ssrRenderComponent(_component_ClientOnly, null, {
          fallback: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"${_scopeId}></div>`);
            } else {
              return [
                createVNode("div", { class: "animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent" })
              ];
            }
          })
        }, _parent));
        _push(`</div></div></div><div class="card p-4"><h3 class="text-sm font-bold text-gray-900 mb-3">Top Produk Terjual</h3>`);
        if (!unref(topProducts).length) {
          _push(`<div class="text-sm text-gray-400 py-4 text-center">Belum ada produk terjual</div>`);
        } else {
          _push(`<div class="divide-y divide-gray-100"><!--[-->`);
          ssrRenderList(unref(topProducts), (item, i) => {
            _push(`<div class="flex items-center justify-between py-3"><div class="flex items-center gap-3"><span class="w-5 h-5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold flex items-center justify-center">${ssrInterpolate(i + 1)}</span><div><p class="text-sm font-medium text-gray-800">${ssrInterpolate(item.title)}</p><p class="text-xs text-gray-400">${ssrInterpolate(item.count)} terjual · Rp ${ssrInterpolate(formatPrice(item.revenue))}</p></div></div><p class="text-sm font-bold text-brand-600">Rp ${ssrInterpolate(formatPrice(item.revenue))}</p></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "orders") {
        _push(`<div><div class="flex items-center justify-between mb-4 gap-3 flex-wrap"><h2 class="text-lg font-bold text-gray-900">Daftar Pesanan</h2><div class="flex items-center gap-2">`);
        if (unref(selectedOrderIds).size > 0) {
          _push(`<button class="btn-primary text-sm"${ssrIncludeBooleanAttr(unref(bulkNotifying)) ? " disabled" : ""}>`);
          if (unref(bulkNotifying)) {
            _push(`<span class="inline-block h-3.5 w-3.5 rounded-full border-2 border-black/30 border-t-black animate-spin mr-1"></span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>Kirim WA ke ${ssrInterpolate(unref(selectedOrderIds).size)} terpilih</span></button>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="btn-secondary text-sm"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"></path></svg> Refresh </button></div></div><div class="flex flex-col sm:flex-row gap-2 mb-4"><div class="relative flex-1"><svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><path d="M21 21l-4.35-4.35"></path></svg><input${ssrRenderAttr("value", unref(orderSearch))} type="text" placeholder="Cari nama, nomor HP, atau produk..." class="input-field pl-10"></div><div class="flex gap-2 shrink-0"><!--[-->`);
        ssrRenderList(orderStatusFilters, (f) => {
          _push(`<button class="${ssrRenderClass([unref(orderStatusFilter) === f.value ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400", "px-3 py-2 rounded-lg text-xs font-semibold border transition-colors"])}">${ssrInterpolate(f.label)} <span class="${ssrRenderClass([unref(orderStatusFilter) === f.value ? "bg-white/20" : "bg-gray-100", "ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold"])}">${ssrInterpolate(unref(orderStatusCounts)[f.value] ?? 0)}</span></button>`);
        });
        _push(`<!--]--></div></div>`);
        if (unref(ordersLoading)) {
          _push(`<div class="flex justify-center py-20"><div class="animate-spin h-7 w-7 rounded-full border-2 border-brand-400 border-t-transparent"></div></div>`);
        } else if (!unref(orders)?.length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Belum ada pesanan masuk </div>`);
        } else if (!unref(filteredOrders).length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Tidak ada pesanan yang cocok </div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(filteredOrders), (order) => {
            _push(`<div class="card p-4 flex flex-col sm:flex-row sm:items-center gap-4"><div class="shrink-0 w-5 flex items-center self-start sm:self-auto pt-1 sm:pt-0">`);
            if (order.status === "PENDING_PAYMENT") {
              _push(`<input type="checkbox"${ssrIncludeBooleanAttr(unref(selectedOrderIds).has(order.id)) ? " checked" : ""} class="w-4 h-4 rounded accent-amber-400 cursor-pointer">`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div><div class="flex items-center gap-3 sm:flex-1 min-w-0"><img${ssrRenderAttr("src", order.product.imageUrl)}${ssrRenderAttr("alt", order.product.title)} class="w-12 h-12 rounded-xl object-cover shrink-0 border border-gray-200"><div class="min-w-0"><p class="font-semibold text-gray-900 text-sm line-clamp-1">${ssrInterpolate(order.product.title)}</p><p class="text-brand-600 font-bold text-sm">Rp ${ssrInterpolate(formatPrice(order.product.price))}</p></div></div><div class="sm:flex-1 min-w-0 space-y-0.5"><p class="text-sm font-medium text-gray-800">${ssrInterpolate(order.buyerName)}</p><p class="text-xs text-gray-500 font-mono">${ssrInterpolate(order.buyerPhone)}</p><p class="text-xs text-gray-400">${ssrInterpolate(formatDateTime(order.createdAt))}</p></div><div class="shrink-0 flex flex-col items-start sm:items-end gap-1.5"><span class="${ssrRenderClass([{
              "bg-success-50 text-success-700 border border-success-500/30": order.status === "PAID",
              "bg-amber-50 text-amber-700 border border-brand-300": order.status === "PENDING_PAYMENT",
              "bg-gray-100 text-gray-500 border border-gray-200": order.status === "CANCELLED"
            }, "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"])}"><span class="${ssrRenderClass([{
              "bg-success-700": order.status === "PAID",
              "bg-amber-700": order.status === "PENDING_PAYMENT",
              "bg-gray-400": order.status === "CANCELLED"
            }, "w-1.5 h-1.5 rounded-full"])}"></span> ${ssrInterpolate(order.status === "PAID" ? "Lunas" : order.status === "CANCELLED" ? "Dibatalkan" : "Belum Bayar")}</span>`);
            if (order.notifyCount > 0) {
              _push(`<span class="inline-flex items-center gap-1 text-[11px] text-green-700 font-medium"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.845L0 24l6.344-1.493A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.766.887.935-3.667-.241-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg> ${ssrInterpolate(order.notifyCount)}x · ${ssrInterpolate(formatDateTime(order.lastNotifiedAt))}</span>`);
            } else {
              _push(`<span class="inline-flex items-center gap-1 text-[11px] text-gray-400"><svg class="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"></path><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.554 4.118 1.523 5.845L0 24l6.344-1.493A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.645-.52-5.148-1.424l-.369-.219-3.766.887.935-3.667-.241-.381A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"></path></svg> Belum dikirim </span>`);
            }
            _push(`</div><div class="flex gap-2 shrink-0 flex-wrap">`);
            if (order.paymentProof) {
              _push(`<a${ssrRenderAttr("href", order.paymentProof)} target="_blank" class="btn-secondary text-xs px-3 py-1.5"> Bukti </a>`);
            } else {
              _push(`<!---->`);
            }
            if (order.status !== "CANCELLED") {
              _push(`<!--[--><button class="btn-secondary text-xs px-3 py-1.5"${ssrIncludeBooleanAttr(unref(notifying) === order.id) ? " disabled" : ""}>`);
              if (unref(notifying) === order.id) {
                _push(`<span class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>`);
              } else {
                _push(`<span>WA</span>`);
              }
              _push(`</button>`);
              if (order.status === "PENDING_PAYMENT") {
                _push(`<button class="btn-primary text-xs px-3 py-1.5"> Upload Bukti </button>`);
              } else {
                _push(`<!---->`);
              }
              if (order.status === "PENDING_PAYMENT") {
                _push(`<button class="text-xs px-3 py-1.5 rounded-lg border border-error-200 text-error-600 hover:bg-error-50 transition-colors"${ssrIncludeBooleanAttr(unref(cancelling) === order.id) ? " disabled" : ""}>`);
                if (unref(cancelling) === order.id) {
                  _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-400 border-t-transparent animate-spin"></span>`);
                } else {
                  _push(`<span>Batalkan</span>`);
                }
                _push(`</button>`);
              } else {
                _push(`<!---->`);
              }
              _push(`<!--]-->`);
            } else {
              _push(`<!---->`);
            }
            _push(`</div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else if (unref(activeTab) === "products") {
        _push(`<div><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-gray-900">Manajemen Produk</h2><button class="btn-primary">+ Tambah Produk</button></div>`);
        if (!unref(products)?.length) {
          _push(`<div class="card p-12 text-center text-gray-400"> Belum ada produk </div>`);
        } else {
          _push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"><!--[-->`);
          ssrRenderList(unref(products), (product) => {
            _push(`<div class="card overflow-hidden"><div class="relative aspect-square bg-gray-100"><img${ssrRenderAttr("src", product.imageUrl)}${ssrRenderAttr("alt", product.title)} class="w-full h-full object-cover"><span class="${ssrRenderClass([product.status === "AVAILABLE" ? "bg-brand-400 text-black" : "bg-gray-600 text-white", "absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"])}">${ssrInterpolate(product.status === "AVAILABLE" ? "Tersedia" : "Sold Out")}</span></div><div class="p-3"><p class="font-semibold text-sm text-gray-900 line-clamp-2 leading-tight">${ssrInterpolate(product.title)}</p><p class="text-brand-600 font-bold text-sm mt-0.5">Rp ${ssrInterpolate(formatPrice(product.price))}</p><div class="mt-1.5">`);
            if (product.sessionId) {
              _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-medium truncate max-w-full">${ssrInterpolate(sessionLabel(product.sessionId))}</span>`);
            } else {
              _push(`<span class="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400"> Belum ke sesi </span>`);
            }
            _push(`</div><div class="flex gap-2 mt-3"><button class="btn-secondary text-xs flex-1 py-1.5">Edit</button><button class="flex-1 py-1.5 rounded-xl text-xs font-semibold bg-error-50 text-error-600 border border-error-100 hover:bg-red-100 transition-colors"${ssrIncludeBooleanAttr(unref(deletingProduct) === product.id) ? " disabled" : ""}>`);
            if (unref(deletingProduct) === product.id) {
              _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>`);
            } else {
              _push(`<span>Hapus</span>`);
            }
            _push(`</button></div></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div>`);
      } else if (unref(activeTab) === "config") {
        _push(`<div><div class="flex items-start gap-6 flex-col lg:flex-row"><div class="w-full max-w-sm shrink-0"><h2 class="text-lg font-bold text-gray-900 mb-4">Tambah Sesi Flash Sale</h2><div class="card p-5"><form class="space-y-4"><div><label class="label-text">Judul Sesi</label><input${ssrRenderAttr("value", unref(configForm).title)} type="text" placeholder="Flash Sale Pagi" class="input-field"></div><div><label class="label-text">Waktu Mulai <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(configForm).startTime)} type="datetime-local" class="input-field" required></div><div><label class="label-text">Waktu Selesai <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(configForm).endTime)} type="datetime-local" class="input-field" required></div><button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(savingConfig)) ? " disabled" : ""}>`);
        if (unref(savingConfig)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>+ Tambah Sesi</span>`);
        }
        _push(`</button></form></div></div><div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-4"><h2 class="text-lg font-bold text-gray-900">Jadwal Sesi</h2><button class="btn-secondary text-sm"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 4v6h6M23 20v-6h-6"></path><path d="M20.49 9A9 9 0 005.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 013.51 15"></path></svg> Refresh </button></div>`);
        if (unref(sessionsLoading)) {
          _push(`<div class="flex justify-center py-12"><div class="animate-spin h-6 w-6 rounded-full border-2 border-brand-400 border-t-transparent"></div></div>`);
        } else if (!unref(sessions)?.length) {
          _push(`<div class="card p-8 text-center text-gray-400"> Belum ada sesi terjadwal </div>`);
        } else {
          _push(`<div class="space-y-3"><!--[-->`);
          ssrRenderList(unref(sessionsSorted), (session) => {
            _push(`<div class="${ssrRenderClass([sessionStatus(session) === "active" ? "border-brand-400 bg-brand-25" : "", "card p-4 flex items-center gap-4"])}"><div class="shrink-0"><span class="${ssrRenderClass([{
              "bg-brand-400": sessionStatus(session) === "active",
              "bg-gray-300": sessionStatus(session) === "upcoming" && !session.isActive,
              "bg-gray-200": sessionStatus(session) === "ended",
              "bg-blue-400": sessionStatus(session) === "upcoming" && session.isActive
            }, "inline-block w-2.5 h-2.5 rounded-full"])}"></span></div><div class="flex-1 min-w-0"><p class="font-semibold text-gray-900 text-sm">${ssrInterpolate(session.title)}</p><p class="text-xs text-gray-500 mt-0.5">${ssrInterpolate(formatDateTime(session.startTime))} – ${ssrInterpolate(formatDateTime(session.endTime))}</p><div class="flex items-center gap-2 mt-1 flex-wrap"><span class="${ssrRenderClass([{
              "bg-brand-50 text-brand-700": sessionStatus(session) === "active",
              "bg-blue-50 text-blue-700": sessionStatus(session) === "upcoming" && session.isActive,
              "bg-gray-100 text-gray-500": sessionStatus(session) === "upcoming" && !session.isActive,
              "bg-gray-100 text-gray-400": sessionStatus(session) === "ended"
            }, "text-xs font-semibold px-2 py-0.5 rounded-full"])}">${ssrInterpolate(sessionStatus(session) === "active" ? "🟢 Sedang Berjalan" : sessionStatus(session) === "ended" ? "Selesai" : session.isActive ? "🔵 Terjadwal" : "⚪ Nonaktif")}</span><span class="text-xs text-gray-400">${ssrInterpolate(session._count?.products ?? 0)} produk </span></div></div><div class="flex items-center gap-2 shrink-0">`);
            if (sessionStatus(session) !== "ended") {
              _push(`<button class="${ssrRenderClass([session.isActive ? "border-gray-200 bg-white text-gray-600 hover:bg-gray-50" : "border-brand-300 bg-brand-50 text-brand-700 hover:bg-brand-100", "text-xs px-2.5 py-1.5 rounded-lg border font-semibold transition-colors"])}"${ssrIncludeBooleanAttr(unref(togglingSession) === session.id) ? " disabled" : ""}>`);
              if (unref(togglingSession) === session.id) {
                _push(`<span class="inline-block h-3 w-3 rounded-full border border-gray-400 border-t-transparent animate-spin"></span>`);
              } else {
                _push(`<span>${ssrInterpolate(session.isActive ? "Nonaktifkan" : "Aktifkan")}</span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<!---->`);
            }
            _push(`<button class="text-xs px-2.5 py-1.5 rounded-lg border border-error-100 bg-error-50 text-error-600 font-semibold hover:bg-red-100 transition-colors"${ssrIncludeBooleanAttr(unref(deletingSession) === session.id) ? " disabled" : ""}>`);
            if (unref(deletingSession) === session.id) {
              _push(`<span class="inline-block h-3 w-3 rounded-full border border-error-600/40 border-t-error-600 animate-spin"></span>`);
            } else {
              _push(`<span>Hapus</span>`);
            }
            _push(`</button></div></div>`);
          });
          _push(`<!--]--></div>`);
        }
        _push(`</div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      if (unref(showProductModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"><h2 class="text-lg font-bold text-gray-900 mb-4">${ssrInterpolate(unref(editingProduct) ? "Edit Produk" : "Tambah Produk")}</h2><form class="space-y-4"><div><label class="label-text">Nama Produk <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(productForm).title)} type="text" placeholder="Nama produk" class="input-field" required></div><div><label class="label-text">Harga (Rp) <span class="text-error-600">*</span></label><input${ssrRenderAttr("value", unref(productForm).price)} type="number" placeholder="150000" class="input-field" required></div><div><label class="label-text">Daftarkan ke Sesi Flash Sale</label><select class="input-field"><option value=""${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).sessionId) ? ssrLooseContain(unref(productForm).sessionId, "") : ssrLooseEqual(unref(productForm).sessionId, "")) ? " selected" : ""}>— Tidak didaftarkan ke sesi —</option><!--[-->`);
        ssrRenderList(unref(sessions), (s) => {
          _push(`<option${ssrRenderAttr("value", s.id)}${ssrIncludeBooleanAttr(Array.isArray(unref(productForm).sessionId) ? ssrLooseContain(unref(productForm).sessionId, s.id) : ssrLooseEqual(unref(productForm).sessionId, s.id)) ? " selected" : ""}>${ssrInterpolate(s.title)} (${ssrInterpolate(formatDateTime(s.startTime))} – ${ssrInterpolate(formatTime(s.endTime))}) </option>`);
        });
        _push(`<!--]--></select></div><div><label class="label-text">Deskripsi</label><textarea rows="3" placeholder="Deskripsi produk (opsional)" class="input-field resize-none">${ssrInterpolate(unref(productForm).description)}</textarea></div><div><label class="label-text">${ssrInterpolate(unref(editingProduct) ? "Foto Utama (kosongkan jika tidak diubah)" : "Foto Utama *")}</label><input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"></div><div><label class="label-text">Foto Tambahan (bisa pilih beberapa)</label><input type="file" accept="image/*" multiple class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer">`);
        if (unref(extraFiles).length) {
          _push(`<p class="text-xs text-gray-400 mt-1">${ssrInterpolate(unref(extraFiles).length)} foto dipilih</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-3 pt-2"><button type="button" class="btn-secondary-full">Batal</button><button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(savingProduct)) ? " disabled" : ""}>`);
        if (unref(savingProduct)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Simpan</span>`);
        }
        _push(`</button></div></form></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(showProofModal)) {
        _push(`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 py-6"><div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div><div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"><h2 class="text-lg font-bold text-gray-900 mb-1">Upload Bukti Transfer</h2><p class="text-sm text-gray-500 mb-4">Status pesanan akan otomatis berubah menjadi <strong>Lunas</strong></p><div class="space-y-4"><div><label class="label-text">File Bukti Transfer</label><input type="file" accept="image/*" class="block w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 cursor-pointer"></div><div class="flex gap-3 pt-2"><button class="btn-secondary-full">Batal</button><button class="btn-primary-full"${ssrIncludeBooleanAttr(unref(uploadingProof)) ? " disabled" : ""}>`);
        if (unref(uploadingProof)) {
          _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
        } else {
          _push(`<span>Konfirmasi Lunas</span>`);
        }
        _push(`</button></div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(toast).visible) {
        _push(`<div class="fixed bottom-6 left-1/2 -translate-x-0.5 z-[60] w-full max-w-sm px-4"><div class="${ssrRenderClass([unref(toast).type === "success" ? "bg-success-50 border border-success-500/30 text-success-700" : "bg-error-50 border border-error-100 text-error-600", "rounded-xl px-4 py-3 shadow-lg flex items-center gap-3 text-sm font-medium"])}"><span>${ssrInterpolate(unref(toast).type === "success" ? "✓" : "✕")}</span><span>${ssrInterpolate(unref(toast).message)}</span></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-s912KPbl.js.map
