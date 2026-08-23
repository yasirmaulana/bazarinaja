import { d as defineEventHandler, b as deleteCookie } from '../../../nitro/nitro.mjs';
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

const logout_post = defineEventHandler((event) => {
  deleteCookie(event, "admin_session");
  return { success: true };
});

export { logout_post as default };
//# sourceMappingURL=logout.post.mjs.map
