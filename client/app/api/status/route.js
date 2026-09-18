import { NextResponse } from 'next/server';
import config from '@/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch(`${config.api.url}/status`, {
      next: {
        revalidate: 60
      },
      signal: AbortSignal.timeout(8000)
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'DOWN' }, { status: 503 });
  }
}