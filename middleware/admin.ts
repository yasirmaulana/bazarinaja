export default defineNuxtRouteMiddleware((to) => {
  const cookie = useCookie('admin_session')
  if (!cookie.value && to.path.startsWith('/admin') && to.path !== '/admin/login') {
    return navigateTo('/admin/login')
  }
})
