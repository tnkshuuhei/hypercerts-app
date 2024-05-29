"use client";

import { ComboSelect } from "@/components/combobox";
import HypercertCard from "@/components/hypercert-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { SUPPORTED_CHAINS } from "@/lib/constants";
import { HypercertMetadata, validateMetaData } from "@hypercerts-org/sdk";
import { Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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

const SearchBar = ({
  searchInput,
  setSearchInput,
  executeSearch,
}: {
  searchInput: string;
  setSearchInput: (searchInput: string) => void;
  executeSearch: (searchInput: string) => void;
}) => (
  <div className="relative flex-1 max-w-xl">
    <span className="absolute top-1/2 left-2 transform -translate-y-1/2">
      <Search className="text-slate-00" />
    </span>

    <div className="flex w-full gap-1">
      <Input
        value={searchInput}
        className="pl-10 h-10 border-vd-blue-500 bg-vd-beige-100 py-2 text-sm md:text-base font-medium placeholder:text-vd-blue-500/60 ring-offset-white focus-visible:ring-offset-2 focus-visible:ring-vd-blue-400 focus-visible:ring-2"
        placeholder="Search"
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <Button className="rounded-md" onClick={() => executeSearch(searchInput)}>
        Search
      </Button>
    </div>
  </div>
);

const deDuplicateHypercerts = (hypercerts: HypercertResponseData[]) => {
  const uniqueHypercerts = [];
  const seenUris = new Set();
  for (const hypercert of hypercerts) {
    if (!seenUris.has(hypercert.uri)) {
      seenUris.add(hypercert.uri);
      uniqueHypercerts.push(hypercert);
    }
  }
  return uniqueHypercerts;
};

export default function Explore() {
  const { client } = useHypercertClient();
  const [loading, setLoading] = useState(true);
  const [hypercerts, setHypercerts] = useState<
    { hypercertId: string; chainId: number; metadata: HypercertMetadata }[]
  >([]);
  const [searchInput, setSearchInput] = useState("");
  const [chainFilterOptions, setChainFilterOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const createChainFilterOptions = (chains: number[]) => {
    const supportedChains = Array.from(SUPPORTED_CHAINS.entries()).map(
      ([chainId, chainName]) => ({
        value: chainId,
        label: chainName,
      })
    );
    const dynamicOptions = supportedChains
      .filter((chain) => chains.includes(chain.value))
      .map((chain) => ({
        value: chain.value.toString(),
        label: chain.label,
      }));

    const chainOptions = [{ value: "", label: "All" }, ...dynamicOptions];

    return setChainFilterOptions(chainOptions);
  };

  const executeSearch = useCallback((searchInput: string) => {
    console.log(searchInput);
  }, []);

  const getHypercertMetadata = useCallback(
    async (uri: string, chainId: number) => {
      const response = await client?.storage.getMetadata(uri);
      const { data, valid, errors } = validateMetaData(response);
      if (valid) {
        return {
          hypercertId: uri,
          chainId,
          metadata: data as HypercertMetadata,
        };
      } else {
        console.log(errors);
      }
      return response;
    },
    [client]
  );

  const getHypercerts = useCallback(async () => {
    try {
      const response = await client?.indexer.recentHypercerts({ first: 20 });
      const hypercertData = response?.hypercerts
        .data as HypercertResponseData[];
      console.log(hypercertData);
      return hypercertData;
    } catch (error) {
      console.error("Failed to fetch recent hypercerts:", error);
      setHypercerts([]);
    }
    setLoading(false);
  }, [client, setLoading, setHypercerts]);

  const setupHypercertPageData = useCallback(async () => {
    const hypercerts = await getHypercerts();

    if (hypercerts) {
      const dedupedHypercerts = deDuplicateHypercerts(hypercerts);
      const chainIds = dedupedHypercerts
        .map((hypercert) => hypercert.contract?.chain_id)
        .filter((chainId) => chainId);
      createChainFilterOptions(chainIds);
      const metadataPromises = dedupedHypercerts
        .filter((hypercert) => hypercert.uri) // Only process if URI is present
        .map((hypercert) =>
          getHypercertMetadata(
            hypercert.uri!,
            hypercert.contract?.chain_id || 1
          )
        );

      const metadatas = await Promise.all(metadataPromises);
      setHypercerts(
        metadatas as unknown as {
          hypercertId: string;
          chainId: number;
          metadata: HypercertMetadata;
        }[]
      );
    }
  }, [getHypercerts, getHypercertMetadata, setHypercerts]);

  useEffect(() => {
    setupHypercertPageData();
  }, [setupHypercertPageData]);

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

        <SearchBar
          searchInput={searchInput}
          setSearchInput={setSearchInput}
          executeSearch={executeSearch}
        />

        {chainFilterOptions.length > 0 && (
          <ComboSelect
            options={chainFilterOptions}
            groupLabel="chain"
            groupLabelPlural="chains"
          />
        )}
        <div className="flex justify-center md:justify-start flex-wrap gap-5">
          {hypercerts.map((hypercert) => (
            <HypercertCard
              {...hypercert.metadata}
              hypercertId={hypercert.hypercertId}
              key={hypercert.hypercertId}
            />
          ))}
        </div>
      </main>
    </>
  );
}
