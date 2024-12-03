"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePathServerAction(paths: string[]) {
  paths.forEach((path) => {
    revalidatePath(path);
  });
}
