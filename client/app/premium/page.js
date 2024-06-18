import { redirect } from 'next/navigation';
import getPlans from '@/lib/request/payments/getPlans';
import Content from '@/app/premium/content';

export default async function Page() {
  const plans = await getPlans().catch(error => error);
  if (typeof plans === 'string') return redirect(`/error?message=${encodeURIComponent(plans)}`);
  
  return <Content plans={plans} />;
}