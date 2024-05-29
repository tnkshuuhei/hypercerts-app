"use client";

import HypercertCard, {
  type HypercertCardProps,
} from "@/components/hypercert-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { validateMetaData } from "@hypercerts-org/sdk";
import { Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

// export const metadata = {
//   title: "Explore",
//   description:
//     "The best place to discover and contribute to hypercerts and hyperboards.",
// };

type HypercertResponseData = {
  __typename?: "Hypercert";
  hypercert_id?: string | null;
  owner_address?: string | null;
  units?: any | null;
  uri?: string | null;
  contract?: {
    __typename?: "Contract";
    chain_id?: any | null;
  } | null;
};

export default function Explore() {
  const { client } = useHypercertClient();
  const [loading, setLoading] = useState(true);
  const [hypercerts, setHypercerts] = useState<HypercertCardProps[]>([]);
  const [searchInput, setSearchInput] = useState("");

  const executeSearch = useCallback((searchInput: string) => {
    console.log(searchInput);
  }, []);

  useEffect(() => {
    const getHypercertMetadata = async (uri: string) => {
      const response = await client?.storage.getMetadata(uri);
      const { data, valid, errors } = validateMetaData(response);
      if (valid) {
        return { hypercertId: uri, ...(data as HypercertCardProps) };
      } else {
        console.log(errors);
      }
      return response;
    };
    const getHypercerts = async () => {
      try {
        const response = await client?.indexer.recentHypercerts({ first: 10 });
        const hypercertData = response?.hypercerts
          .data as HypercertResponseData[];
        if (hypercertData) {
          const metadata = await Promise.all(
            hypercertData.map(async (hypercert) => {
              if (hypercert.uri) {
                const metadata = await getHypercertMetadata(hypercert.uri);
                return metadata;
              }
            })
          );
          setHypercerts(metadata as unknown as HypercertCardProps[]);
        }
      } catch (error) {
        console.error("Failed to fetch recent hypercerts:", error);
        setHypercerts([]);
      }
      setLoading(false);
      // console.log(hypercerts);
      // return hypercerts;
    };
    getHypercerts();
  }, [client]);

  if (hypercerts) {
    console.log(hypercerts[0]);
  }

  const SearchBar = () => (
    <div className="relative flex-1 max-w-xl">
      <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <Search className="text-slate-00" />
      </span>

      <div className="flex w-full gap-1">
        <Input
          // value={searchInput}
          className="pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-sm md:text-base font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2"
          placeholder="Search"
          // onChange={(e) => setSearchInput(e.target.value)}
        />
        <Button
          className="rounded-md"
          onClick={() => executeSearch(searchInput)}
        >
          Search
        </Button>
      </div>
    </div>
  );

  return (
    <>
      <main className="flex flex-col p-8 md:p-24 pb-24 space-y-4">
        <section>
          <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
            Explore
          </h1>
          <div className="p-1"></div>
          <p className="md:text-lg">
            The best place to discover and contribute to hypercerts and
            hyperboards.
          </p>
        </section>

        <SearchBar />
        <div className="flex flex-wrap gap-5">
          {hypercerts.map((hypercert) => (
            <HypercertCard {...hypercert} key={hypercert.hypercertId} />
          ))}
        </div>
      </main>
    </>
  );
}
