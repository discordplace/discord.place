'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidateSound(id) {
  revalidatePath(`/sounds/${id}`);
}