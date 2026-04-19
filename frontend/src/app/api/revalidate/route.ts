import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));

  if (!REVALIDATE_SECRET || body.secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const paths = (Array.isArray(body.paths) ? body.paths : ['/'])
    .slice(0, 20)
    .filter((p: unknown): p is string => typeof p === 'string');

  for (const path of paths) {
    revalidatePath(path);
  }

  return NextResponse.json({ revalidated: true, paths });
}
