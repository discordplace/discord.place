'use client';

import { redirect } from 'next/navigation';

export default function Page({ params }) {
  redirect(`/profile/${params.slug}`);
}