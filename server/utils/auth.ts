import type { H3Event } from 'h3'

export function requireAdminSession(event: H3Event) {
  const session = getCookie(event, 'admin_session')
  if (!session || session !== 'authenticated') {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }
}
