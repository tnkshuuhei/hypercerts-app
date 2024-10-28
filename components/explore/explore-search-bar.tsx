"use client";

import { Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useCallback, useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export default function ExploreSearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );

  const updateSearchParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("search", value);
      } else {
        params.delete("search");
      }
      params.set("p", "1"); // Reset to first page on new search
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router],
  );

  const debouncedSearch = useDebouncedCallback(
    (value) => updateSearchParams(value),
    300,
  );

  useEffect(() => {
    setSearchInput(searchParams.get("search") || "");
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    debouncedSearch(value);
  };

  const clearSearch = () => {
    setSearchInput("");
    updateSearchParams("");
  };

  return (
    <div className="flex gap-2 w-full max-w-screen-sm min-w-fit justify-between">
      <div className="relative w-full">
        <label htmlFor="search-input" className="sr-only">
          Search hypercerts
        </label>
        <Search
          className="text-slate-400 absolute top-1/2 left-2 transform -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          id="search-input"
          value={searchInput}
          className="w-full pl-10 h-10 border-slate-500 bg-slate-50 py-2 text-sm md:text-base font-medium placeholder:text-slate-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-black focus-visible:ring-2"
          placeholder="Search hypercerts"
          onChange={handleInputChange}
          aria-label="Search hypercerts"
        />
        {searchInput && (
          <button
            type="button"
            onClick={clearSearch}
            className="text-slate-400 absolute top-1/2 right-2 transform -translate-y-1/2 h-7 w-7 cursor-pointer hover:bg-slate-100 p-1 rounded-sm"
            aria-label="Clear search"
          >
            <X />
          </button>
        )}
      </div>
      <Button
        className="rounded-md"
        onClick={() => updateSearchParams(searchInput)}
        aria-label="Submit search"
      >
        Search
      </Button>
    </div>
  );
}
