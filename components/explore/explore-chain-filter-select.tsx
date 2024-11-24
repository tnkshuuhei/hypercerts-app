"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { SUPPORTED_CHAINS } from "@/configs/constants";

interface ChainFilterSelectProps {
  value?: string;
}

export default function ChainFilterSelect({ value }: ChainFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === "all") {
      params.delete("chain");
    } else {
      params.set("chain", newValue);
    }
    params.set("p", "1"); // Reset page when changing filter
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={value || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All chains" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value="all">All chains</SelectItem>
        {SUPPORTED_CHAINS.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
