"use server";

import { revalidatePath } from "next/cache";

export async function clearCacheAfterListing(hypercertId: string | null) {
  if (!hypercertId) {
    return;
  }

  // Clear cache on successful attestation
  revalidatePath("/explore");
  revalidatePath(`/hypercerts/${hypercertId}`);
}
