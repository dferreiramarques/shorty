import { NextRequest, NextResponse } from 'next/server';
import { getUrl } from '@/lib/kv';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  
  if (!slug || slug === 'favicon.ico' || slug === 'api' || slug.startsWith('_')) {
    return NextResponse.next();
  }

  if (!/^[a-zA-Z0-9-]+$/.test(slug)) {
    return NextResponse.next();
  }

  const originalUrl = await getUrl(slug);

  if (!originalUrl) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.redirect(originalUrl, 302);
}