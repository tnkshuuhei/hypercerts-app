"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExploreOrderBySelectProps {
  value?: string;
}

export default function ExploreOrderBySelect({
  value,
}: ExploreOrderBySelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedValue = value || "created_desc";

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("orderBy", newValue);
    params.set("p", "1"); // Reset to first page when changing order
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={selectedValue} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="w-max">
        <SelectItem value="created_desc">Newest first</SelectItem>
        <SelectItem value="created_asc">Oldest first</SelectItem>
        <SelectItem value="attestations_count_desc">
          Most evaluations first
        </SelectItem>
        <SelectItem value="attestations_count_asc">
          Fewest evaluations first
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
