import { defineComponent, reactive, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    const form = reactive({ username: "", password: "" });
    const loading = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-gray-50 font-body flex items-center justify-center px-4 py-16" }, _attrs))}><div class="w-full max-w-sm"><div class="text-center mb-8"><div class="inline-flex items-center justify-center w-14 h-14 bg-brand-400 rounded-2xl shadow-xs mb-4"><svg class="w-7 h-7" viewBox="0 0 24 24" fill="none"><path d="M13 2L4.09 12.11A1 1 0 004 13h7l-1 9 9.91-11.11A1 1 0 0020 10h-7l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg></div><h1 class="text-2xl font-bold text-gray-900 tracking-tight">Flash Sale Admin</h1><p class="text-sm text-gray-500 mt-1">Masuk ke dashboard pengelolaan</p></div><div class="card p-6 shadow-lg"><form class="space-y-4"><div><label class="label-text">Username</label><input${ssrRenderAttr("value", unref(form).username)} type="text" placeholder="Masukkan username" class="input-field" autocomplete="username" required></div><div><label class="label-text">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022" class="input-field" autocomplete="current-password" required></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="flex items-center gap-2 p-3 bg-error-50 border border-error-100 rounded-xl text-sm text-error-600"><span>\u2715</span> ${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit" class="btn-primary-full"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""}>`);
      if (unref(loading)) {
        _push(`<span class="inline-block h-4 w-4 rounded-full border-2 border-black/30 border-t-black animate-spin"></span>`);
      } else {
        _push(`<span>Masuk</span>`);
      }
      _push(`</button></form></div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=login-DyiVwfXG.mjs.map
