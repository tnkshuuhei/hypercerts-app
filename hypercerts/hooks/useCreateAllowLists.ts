import { useMutation, useQuery } from "@tanstack/react-query";

import { AllowlistEntry } from "@hypercerts-org/sdk";
import { HYPERCERTS_API_URL_REST } from "../../configs/hypercerts";

export const useCreateAllowList = () => {
  return useMutation({
    mutationFn: ({
      allowList,
      totalUnits,
    }: {
      allowList: AllowlistEntry[];
      totalUnits: bigint;
    }) => {
      const allowListString = JSON.stringify(allowList, (key, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      });
      return fetch(`${HYPERCERTS_API_URL_REST}/allowlists`, {
        method: "POST",
        body: JSON.stringify({
          allowList: allowListString,
          totalUnits: totalUnits.toString(),
        }),
      });
    },
  });
};
