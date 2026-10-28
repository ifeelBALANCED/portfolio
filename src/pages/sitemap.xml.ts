import type { APIRoute } from 'astro';
import { sitemapXml } from '../domain/locale';

export const GET: APIRoute = ({ site }) =>
  new Response(sitemapXml(new URL('/', site).origin), {
    headers: { 'content-type': 'application/xml; charset=utf-8' },
  });
