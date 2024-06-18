"use server";

import { revalidatePath } from "next/cache";

export async function clearCacheAfterEvaluation(hypercertId: string | null) {
  if (!hypercertId) {
    return;
  }

  // Clear cache on successful attestation
  revalidatePath("/explore");
  revalidatePath(`/hypercerts/${hypercertId}`);
}
