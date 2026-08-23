export default defineEventHandler((event) => {
  const path = getRequestURL(event).pathname
  if (!path.startsWith('/admin') || path === '/admin/login') return

  // Hanya berlaku untuk API admin, bukan halaman (halaman di-handle route middleware)
  if (!path.startsWith('/api/admin')) return

  const session = getCookie(event, 'admin_session')
  if (session !== 'authenticated') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
})
