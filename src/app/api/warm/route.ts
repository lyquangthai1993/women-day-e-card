import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing card id' }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const targets = [
    `${origin}/vi/card/${id}`,
    `${origin}/card/${id}`,
    `${origin}/vi/card?id=${id}`,
    `${origin}/card?id=${id}&lang=en`,
  ];

  // Pre-warm các routes tĩnh và SSR trên Vercel Edge CDN
  await Promise.allSettled(
    targets.map((url) =>
      fetch(url, {
        method: 'GET',
        cache: 'reload',
      })
    )
  );

  return NextResponse.json({
    success: true,
    cardId: id,
    message: 'Pre-warmed ISR and Edge Cache successfully',
    targets,
  });
}
