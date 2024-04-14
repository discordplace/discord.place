'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidateServer(serverId) {
  revalidatePath(`/servers/${serverId}`);
}