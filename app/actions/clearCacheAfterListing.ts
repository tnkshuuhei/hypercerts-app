"use server";

import { revalidatePath } from "next/cache";

export async function clearCacheAfterListing(hypercertId: string | null) {
  if (!hypercertId) {
    return;
  }

  revalidatePath("/explore");
  revalidatePath(`/hypercerts/${hypercertId}`);
}
