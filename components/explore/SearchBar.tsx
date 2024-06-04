"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");

  const search = () => {
    const urlSearchParams = new URLSearchParams(searchParams);
    urlSearchParams.set("search", searchInput);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  return (
    <div className="relative">
      <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <Search className="text-slate-400" />
      </span>

      <div className="flex gap-2">
        <Input
          value={searchInput}
          className="max-w-xs pl-10 h-10 border-slate-500 bg-slate-50 py-2 text-sm md:text-base font-medium placeholder:text-slate-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-slate-400 focus-visible:ring-2"
          placeholder="Search hypercerts"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button className="rounded-md" onClick={search}>
          Search
        </Button>
      </div>
    </div>
  );
}
