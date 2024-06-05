"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { ComboSelect } from "../combobox";
import { SUPPORTED_CHAINS } from "../../lib/constants";

export default function ChainFilterSelect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectFilter = (value: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    if (value === "all") {
      urlSearchParams.delete("chain");
    } else {
      urlSearchParams.set("chain", value);
    }
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const chainFilterOptions = [
    { value: "all", label: "All" },
    ...Array.from(SUPPORTED_CHAINS.entries()).map(([chainId, chainName]) => ({
      value: chainId.toString(),
      label: chainName,
    })),
  ];

  return (
    <ComboSelect
      options={chainFilterOptions}
      groupLabel="chain"
      groupLabelPlural="chains"
      onValueChange={selectFilter}
    />
  );
}
