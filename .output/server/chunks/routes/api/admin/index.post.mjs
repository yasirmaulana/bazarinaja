import { d as defineEventHandler, r as requireAdminSession, f as readMultipartFormData, c as createError, p as prisma } from '../../../nitro/nitro.mjs';
import { writeFile } from 'fs/promises';
import { join } from 'path';
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

const index_post = defineEventHandler(async (event) => {
  var _a;
  requireAdminSession(event);
  const formData = await readMultipartFormData(event);
  if (!formData) throw createError({ statusCode: 400, statusMessage: "Form data kosong" });
  const fields = {};
  let imageUrl = "";
  const extraImages = [];
  for (const part of formData) {
    if (part.name === "image" && part.filename) {
      const filename = `${Date.now()}-${part.filename}`;
      await writeFile(join(process.cwd(), "public", "uploads", filename), part.data);
      imageUrl = `/uploads/${filename}`;
    } else if (part.name === "images" && part.filename) {
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}-${part.filename}`;
      await writeFile(join(process.cwd(), "public", "uploads", filename), part.data);
      extraImages.push(`/uploads/${filename}`);
    } else if (part.name) {
      fields[part.name] = part.data.toString();
    }
  }
  if (!fields.title || !fields.price) {
    throw createError({ statusCode: 400, statusMessage: "title dan price wajib diisi" });
  }
  const sessionId = fields.sessionId && fields.sessionId !== "" ? fields.sessionId : null;
  const description = fields.description || null;
  if (fields.id) {
    const existing = await prisma.product.findUnique({ where: { id: fields.id }, select: { images: true } });
    return await prisma.product.update({
      where: { id: fields.id },
      data: {
        title: fields.title,
        price: parseFloat(fields.price),
        description,
        sessionId,
        ...imageUrl && { imageUrl },
        // tambah foto baru ke existing, atau pakai yang baru saja
        images: extraImages.length > 0 ? [...(_a = existing == null ? void 0 : existing.images) != null ? _a : [], ...extraImages] : void 0
      }
    });
  }
  if (!imageUrl) throw createError({ statusCode: 400, statusMessage: "Foto produk wajib diupload" });
  return await prisma.product.create({
    data: {
      title: fields.title,
      price: parseFloat(fields.price),
      description,
      imageUrl,
      images: extraImages,
      sessionId,
      status: "AVAILABLE"
    }
  });
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
