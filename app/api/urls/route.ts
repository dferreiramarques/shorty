import { NextRequest, NextResponse } from 'next/server';
import { getAllUrls, setUrl } from '@/lib/kv';

export async function GET() {
  try {
    const urls = await getAllUrls();
    return NextResponse.json({ urls });
  } catch (e) {
    return NextResponse.json(
      { error: 'Erro ao carregar URLs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, url } = body;

    if (!slug || !url) {
      return NextResponse.json(
        { error: 'Slug e URL são obrigatórios' },
        { status: 400 }
      );
    }

    const slugSanitized = slug.toLowerCase().trim();
    
    if (!/^[a-z0-9-]+$/.test(slugSanitized)) {
      return NextResponse.json(
        { error: 'Slug só pode conter letras, números e hífens' },
        { status: 400 }
      );
    }

    const urlValid = new URL(url);
    if (!['http:', 'https:'].includes(urlValid.protocol)) {
      return NextResponse.json(
        { error: 'URL deve começar com http:// ou https://' },
        { status: 400 }
      );
    }

    const result = await setUrl(slugSanitized, url);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 409 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: slugSanitized,
      shortUrl: `/${slugSanitized}`,
    });
  } catch (e) {
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}