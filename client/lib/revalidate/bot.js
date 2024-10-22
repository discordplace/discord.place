'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidateBot(botId) {
  revalidatePath(`/bots/${botId}`);
}