"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function EvaluationFilterSelect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedValue = searchParams.get("evalType") || "any";

  const evalTypes = [
    {
      label: "Verifiably evaluated",
      value: "verified",
    },
    {
      label: "Evaluated",
      value: "evaluated",
    },
  ];

  const selectFilter = (value: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    if (value === "all") {
      urlSearchParams.delete("evalType");
    } else {
      urlSearchParams.set("evalType", value);
    }
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <Select
      defaultValue="evaluated"
      onValueChange={selectFilter}
      value={selectedValue}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select evaluation type" />
      </SelectTrigger>
      <SelectContent className="w-max">
        <SelectItem value="any">Any evaluation type</SelectItem>
        {evalTypes.map((evalType) => (
          <SelectItem key={evalType.value} value={evalType.value}>
            {evalType.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
