import { NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const isRevalidate = searchParams.get('revalidate') === 'true' || searchParams.has('purge');

  if (!id) {
    return NextResponse.json({ error: 'Missing card id' }, { status: 400 });
  }

  // 1. On-Demand Cache Invalidation:
  // Xóa sạch cache cũ từ Next.js Data Cache và Vercel Edge CDN
  try {
    revalidateTag(`card-${id}`);
    revalidateTag('cards');
    revalidatePath(`/[locale]/card/[id]`, 'page');
    revalidatePath(`/[locale]/card`, 'page');
    revalidatePath(`/vi/card/${id}`);
    revalidatePath(`/card/${id}`);
    revalidatePath(`/vi/card`);
    revalidatePath(`/card`);
  } catch (err) {
    console.warn('Revalidation notice:', err);
  }

  const origin = new URL(request.url).origin;
  const targets = [
    `${origin}/vi/card/${id}`,
    `${origin}/card/${id}`,
    `${origin}/vi/card?id=${id}`,
    `${origin}/card?id=${id}&lang=en`,
  ];

  // 2. Kích hoạt re-fetch với cache: 'no-store' để nạp ngay bản mới nhất vào Edge Cache
  await Promise.allSettled(
    targets.map((url) =>
      fetch(url, {
        method: 'GET',
        cache: 'no-store',
      })
    )
  );

  return NextResponse.json({
    success: true,
    cardId: id,
    action: isRevalidate ? 'revalidated_and_warmed' : 'prewarmed',
    message: 'Stale cache purged and fresh ISR generated successfully',
    targets,
  });
}
