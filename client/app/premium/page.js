'use server';

import { redirect } from 'next/navigation';
import getPlans from '@/lib/request/payments/getPlansFromServer';
import Content from '@/app/premium/content';

export async function generateMetadata() {
  return {
    description: 'Get access to exclusive features by subscribing to Discord Place Premium.',
    openGraph: {
      description: 'Get access to exclusive features by subscribing to Discord Place Premium.',
      title: 'Discord Place - Premium'
    },
    title: 'Premium'
  };
}

export default async function Page() {
  const plans = await getPlans().catch(error => error);
  if (typeof plans === 'string') return redirect(`/error?message=${encodeURIComponent(plans)}`);

  return <Content plans={plans} />;
}