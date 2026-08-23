import { d as defineEventHandler, a as readBody, c as createError, s as setCookie, u as useRuntimeConfig } from '../../../nitro/nitro.mjs';
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

const login_post = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const config = useRuntimeConfig();
  if (body.username !== config.adminUsername || body.password !== config.adminPassword) {
    throw createError({ statusCode: 401, statusMessage: "Username atau password salah" });
  }
  setCookie(event, "admin_session", "authenticated", {
    sameSite: "strict",
    maxAge: 60 * 60 * 8
    // 8 jam
  });
  return { success: true };
});

export { login_post as default };
//# sourceMappingURL=login.post.mjs.map
