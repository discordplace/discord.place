'use server';

import { redirect } from 'next/navigation';
import getPlans from '@/lib/request/payments/getPlans';
import Content from '@/app/premium/content';

export async function generateMetadata() {
  return {
    title: 'Premium',
    description: 'Get access to exclusive features by subscribing to Discord Place Premium.',
    openGraph: {
      title: 'Discord Place - Premium',
      description: 'Get access to exclusive features by subscribing to Discord Place Premium.'
    }
  };
}

export default async function Page() {
  const plans = await getPlans(true).catch(error => error);
  if (typeof plans === 'string') return redirect(`/error?message=${encodeURIComponent(plans)}`);

  return <Content plans={plans} />;
}