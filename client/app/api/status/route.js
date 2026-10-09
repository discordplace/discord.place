import { NextResponse } from 'next/server';
import config from '@/config';

export const dynamic = 'force-dynamic';

// Next 15+ no longer caches Route Handlers or fetch requests by default, and
// the previous `cache: 'no-store'` meant every page view with the footer status
// badge produced a fresh upstream request. Those requests share the
// api.discord.place per-IP rate limiter, so ordinary browsing tripped a 429 and
// the badge reported a false outage. `next: { revalidate: 30 }` opts this fetch
// into the Next Data Cache, collapsing it to one upstream call per 30s and
// letting every visitor share the cached result.
export async function GET() {
  const response = await fetch(`${config.api.url}/status`, {
    next: { revalidate: 30 },
    signal: AbortSignal.timeout(8000)
  });

  // A throttled (429) or unreachable api.discord.place is not evidence that the
  // service is down. Throwing fails the revalidation, so Next keeps serving the
  // last good cached response instead of caching a fabricated DOWN.
  if (!response.ok) {
    throw new Error(`Upstream /status responded ${response.status}`);
  }

  const data = await response.json();

  const known = ['UP', 'DOWN', 'DEGRADED', 'MAINTENANCE', 'UNKNOWN'];

  if (!known.includes(data?.status)) {
    throw new Error(`Malformed /status payload: ${JSON.stringify(data)}`);
  }

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, max-age=15, stale-while-revalidate=60' }
  });
}