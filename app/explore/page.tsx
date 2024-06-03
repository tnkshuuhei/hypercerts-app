"use client";

import { ComboSelect } from "@/components/combobox";
import HypercertMiniDisplay from "@/components/hypercert-mini-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const testHypercerts = {
  data: {
    hypercerts: {
      count: 434,
      data: [
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-146321417776003539289251081195660330926080",
          units: "10000",
          uri: "bafkreiactmy4uzzs7fig7xiaee4v5w2pn7pxk5telqbrnslrfslhwbqn3u",
          attestations: {
            count: 2,
            data: [
              {
                data: {
                  tags: ["fake"],
                  chain_id: 11155111,
                  comments: "Nothing is real.",
                  token_id: "146321417776003539289251081195660330926080",
                  evaluate_work: 2,
                  evaluate_basic: 2,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 2,
                  evaluate_contributors: 2,
                },
                attester: "0x774e0Fc0DED22cA78D8f55d1307a2FD38a420CBe",
              },
              {
                data: {
                  tags: ["salad", "steak", "sauce", "ketchup"],
                  chain_id: 11155111,
                  comments: "Just evaluating.",
                  token_id: "146321417776003539289251081195660330926080",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 1,
                  evaluate_contributors: 1,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          contract: {
            chain_id: 11155111,
          },
          metadata: {
            name: "Planting trees",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-89153980133285877427404147147123271401472",
          units: "1000000000000000000",
          uri: "bafkreig4vsach3rd3zwahovaiwmo3tdh4ke3cpudjetnslpcerer4qhazm",
          contract: {
            chain_id: 11155111,
          },
          attestations: {
            count: 2,
            data: [
              {
                data: {
                  tags: ["test tag", "test"],
                  chain_id: 11155111,
                  comments:
                    "lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfklsdk laskglsakg lkdlfksd kfdslfka sdfk",
                  token_id: "89153980133285877427404147147123271401472",
                  evaluate_work: 2,
                  evaluate_basic: 2,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 0,
                  evaluate_contributors: 0,
                },
                attester: "0x676703E18b2d03Aa36d6A3124B4F58716dBf61dB",
              },
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments: "yes yes no no",
                  token_id: "89153980133285877427404147147123271401472",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 2,
                  evaluate_contributors: 2,
                },
                attester: "0x676703E18b2d03Aa36d6A3124B4F58716dBf61dB",
              },
            ],
          },
          metadata: {
            name: "Hypercerts 2022: Invention and research",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-1020847100762815390390123822295304634368",
          units: "10000",
          uri: "bafybeidctonxe4ucrgrpfxajwitgix6pyey6ly5nj5sjvofo54uukceq2q",
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments: "",
                  token_id: "1020847100762815390390123822295304634368",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 0,
                  evaluate_contributors: 0,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          contract: {
            chain_id: 11155111,
          },
          metadata: {
            name: "Sepolia mint test 3",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-83709462262550862011990153428214980018176",
          units: "1000000000000000000",
          uri: "bafkreihilgbv7scux3nu6bprltjsgee3bzvxpcrxdmxjujd4mokj25jp74",
          metadata: {
            name: "Return of Teachers at Government School",
          },
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments: "",
                  token_id: "83709462262550862011990153428214980018176",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 0,
                  evaluate_contributors: 0,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          contract: {
            chain_id: 11155111,
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-680564733841876926926749214863536422912",
          units: "18",
          uri: "bafybeic34dh7lfymqjmyme3anexkcbahd64cxhgneeeswmhafp5boyyuzy",
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: ["bb"],
                  chain_id: 11155111,
                  comments: "simply the best",
                  token_id: "680564733841876926926749214863536422912",
                  evaluate_work: 0,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 0,
                  evaluate_contributors: 0,
                },
                attester: "0x774e0Fc0DED22cA78D8f55d1307a2FD38a420CBe",
              },
            ],
          },
          contract: {
            chain_id: 11155111,
          },
          metadata: {
            name: "Second mint",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-86091438830997431256233775680237357498368",
          units: "1000000000000000000",
          uri: "bafkreif26t235rykhu6fnrrt5efdaxomk7xa2a2nxrbdp2ccjuyp2wd3zm",
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments:
                    "A comment regarding the evaluation. A comment regarding the evaluation.",
                  token_id: "86091438830997431256233775680237357498368",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 2,
                  evaluate_contributors: 0,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          metadata: {
            name: "Road Construction in Mamrejpur Village, Chenari Block",
          },
          contract: {
            chain_id: 11155111,
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-135772664401454446921886468365275516370944",
          units: "10000",
          uri: "bafkreihwhp2xrvkejyqpa7zzt4a3ujbz7h7dv7byl2ujtrffe6e2dwonra",
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments: "hjhj",
                  token_id: "135772664401454446921886468365275516370944",
                  evaluate_work: 1,
                  evaluate_basic: 2,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 1,
                  evaluate_contributors: 1,
                },
                attester: "0x676703E18b2d03Aa36d6A3124B4F58716dBf61dB",
              },
            ],
          },
          contract: {
            chain_id: 11155111,
          },
          metadata: {
            name: "Edge City Denver 2024: Designing & producing",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-84390026996392738938916902643078516441088",
          units: "1000000000000000000",
          uri: "bafkreidr6t4ggjo3uzq2co2bp2pfvisk4jdxyxo6uawuaxrh4d3miijmfy",
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: ["road-building", "tag2", "tag3"],
                  chain_id: 11155111,
                  comments: "A comment why I marked some section as invalid.",
                  token_id: "84390026996392738938916902643078516441088",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 2,
                  evaluate_contributors: 2,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          metadata: {
            name: "Salary Arrears Payment to Worker in Bahadurgarh",
          },
          contract: {
            chain_id: 11155111,
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-146661700142924477752714455803092099137536",
          units: "10000",
          uri: "bafkreibdsg6p65razaquzq6o4yearmeo3htqgeuxb5cn4k5gmolaq5flte",
          contract: {
            chain_id: 11155111,
          },
          attestations: {
            count: 1,
            data: [
              {
                data: {
                  tags: [],
                  chain_id: 11155111,
                  comments: "",
                  token_id: "146661700142924477752714455803092099137536",
                  evaluate_work: 1,
                  evaluate_basic: 1,
                  contract_address:
                    "0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941",
                  evaluate_properties: 1,
                  evaluate_contributors: 1,
                },
                attester: "0xa32aECda752cF4EF89956e83d60C04835d4FA867",
              },
            ],
          },
          metadata: {
            name: "My GTest: Project",
          },
        },
        {
          hypercert_id:
            "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-2381976568446569244243622252022377480192",
          units: "10000",
          uri: "bafkreig3wgzxco64k7msxiln5jvhcjjplg2hovyy5ondwfo7sb4ibsb6hy",
          contract: {
            chain_id: 11155111,
          },
          attestations: {
            count: 0,
            data: [],
          },
          metadata: {
            name: "Staffff",
          },
        },
      ],
    },
  },
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
        value: chain.label,
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
      console.log({ response });
      const hypercertData =
        (response?.hypercerts.data as HypercertResponseData[]) ||
        testHypercerts.data.hypercerts.data;
      console.log({ hypercertData });
      setLoading(false);
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        Loading hypercerts...
      </div>
    );
  }

  if (hypercerts.length === 0 && !loading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        We couldn&apos;t find any hypercerts.
      </div>
    );
  }

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
        <section className="flex flex-col md:flex-row gap-4">
          <SearchBar
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            executeSearch={executeSearch}
          />

          <div className="flex gap-2">
            {chainFilterOptions.length > 0 && (
              <ComboSelect
                options={chainFilterOptions}
                groupLabel="chain"
                groupLabelPlural="chains"
              />
            )}

            <Select defaultValue="recent">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Recently added</SelectItem>
                <SelectItem value="a-z">Title (A-Z)</SelectItem>
                <SelectItem value="z-a">Title (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>
        <section className="flex justify-center md:justify-start flex-wrap gap-8 cursor-pointer py-5">
          {hypercerts.map((hypercert) => (
            <div key={hypercert.hypercertId}>
              <HypercertMiniDisplay
                name={hypercert.metadata.name}
                image={hypercert.metadata.image}
                hasTrustedEvaluator={true}
                hypercertId={hypercert.hypercertId}
                lowestPrice={"123 USDC"}
                percentAvailable={0.002}
              />
            </div>
          ))}
        </section>
      </main>
    </>
  );
}
