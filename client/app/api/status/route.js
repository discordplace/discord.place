import { NextResponse } from 'next/server';
import config from '@/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  const response = await fetch(`${config.api.url}/status`, {
    next: {
      revalidate: 60
    }
  });

  const data = await response.json();

  return NextResponse.json(data);
}