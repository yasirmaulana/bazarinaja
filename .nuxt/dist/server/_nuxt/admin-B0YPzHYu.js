import { a as useNuxtApp, g as defineNuxtRouteMiddleware, n as navigateTo } from "../server.mjs";
import { ref } from "vue";
import { parse } from "/home/yasir/Documents/Project/flashsale/node_modules/nuxt/node_modules/cookie-es/dist/index.mjs";
import { getRequestHeader, setCookie, getCookie, deleteCookie } from "/home/yasir/Documents/Project/flashsale/node_modules/h3/dist/index.mjs";
import destr from "/home/yasir/Documents/Project/flashsale/node_modules/destr/dist/index.mjs";
import { isEqual } from "/home/yasir/Documents/Project/flashsale/node_modules/ohash/dist/index.mjs";
import { klona } from "/home/yasir/Documents/Project/flashsale/node_modules/klona/dist/index.mjs";
import { a as useRequestEvent } from "./ssr-Bqnw2a-w.js";
import "/home/yasir/Documents/Project/flashsale/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/home/yasir/Documents/Project/flashsale/node_modules/hookable/dist/index.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/nuxt/node_modules/unctx/dist/index.mjs";
import "vue-router";
import "/home/yasir/Documents/Project/flashsale/node_modules/defu/dist/defu.mjs";
import "/home/yasir/Documents/Project/flashsale/node_modules/ufo/dist/index.mjs";
import "@vueuse/core";
import "tailwind-merge";
import "/home/yasir/Documents/Project/flashsale/node_modules/@unhead/vue/dist/index.mjs";
import "@iconify/vue";
import "vue/server-renderer";
const CookieDefaults = {
  path: "/",
  watch: true,
  decode: (val) => {
    const decoded = decodeURIComponent(val);
    const parsed = destr(decoded);
    if (typeof parsed === "number" && (!Number.isFinite(parsed) || String(parsed) !== decoded)) {
      return decoded;
    }
    return parsed;
  },
  encode: (val) => encodeURIComponent(typeof val === "string" ? val : JSON.stringify(val))
};
function useCookie(name, _opts) {
  const opts = { ...CookieDefaults, ..._opts };
  opts.filter ??= (key) => key === name;
  const cookies = readRawCookies(opts) || {};
  let delay;
  if (opts.maxAge !== void 0) {
    delay = opts.maxAge * 1e3;
  } else if (opts.expires) {
    delay = opts.expires.getTime() - Date.now();
  }
  const hasExpired = delay !== void 0 && delay <= 0;
  const cookieValue = klona(hasExpired ? void 0 : cookies[name] ?? opts.default?.());
  const cookie = ref(cookieValue);
  {
    const nuxtApp = useNuxtApp();
    const writeFinalCookieValue = () => {
      if (opts.readonly || isEqual(cookie.value, cookies[name])) {
        return;
      }
      nuxtApp._cookies ||= {};
      if (name in nuxtApp._cookies) {
        if (isEqual(cookie.value, nuxtApp._cookies[name])) {
          return;
        }
      }
      nuxtApp._cookies[name] = cookie.value;
      writeServerCookie(useRequestEvent(nuxtApp), name, cookie.value, opts);
    };
    const unhook = nuxtApp.hooks.hookOnce("app:rendered", writeFinalCookieValue);
    nuxtApp.hooks.hookOnce("app:error", () => {
      unhook();
      return writeFinalCookieValue();
    });
  }
  return cookie;
}
function readRawCookies(opts = {}) {
  {
    return parse(getRequestHeader(useRequestEvent(), "cookie") || "", opts);
  }
}
function writeServerCookie(event, name, value, opts = {}) {
  if (event) {
    if (value !== null && value !== void 0) {
      return setCookie(event, name, value, opts);
    }
    if (getCookie(event, name) !== void 0) {
      return deleteCookie(event, name, opts);
    }
  }
}
const admin = defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie("admin_session");
  if (!cookie.value && to.path.startsWith("/admin") && to.path !== "/admin/login") {
    return navigateTo("/admin/login");
  }
});
export {
  admin as default
};
//# sourceMappingURL=admin-B0YPzHYu.js.map
