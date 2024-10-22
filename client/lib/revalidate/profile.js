'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidateProfile(slug) {
  revalidatePath(`/profile/${slug}`);
}