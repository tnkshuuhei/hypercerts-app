"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function OrderBySelect() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const orderBy = (value: string) => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("orderBy", value);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <Select defaultValue="recent" onValueChange={orderBy}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="timestamp_desc">Created: New-Old</SelectItem>
        <SelectItem value="timestamp_asc">Created: Old-New</SelectItem>
        <SelectItem value="attestations_desc">Evaluations: Many-Few</SelectItem>
        <SelectItem value="attestations_asc">Evaluations: Few-Many</SelectItem>
      </SelectContent>
    </Select>
  );
}
