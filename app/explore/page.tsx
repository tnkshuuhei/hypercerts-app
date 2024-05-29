"use client";

import HypercertCard, {
  type HypercertCardProps,
} from "@/components/hypercert-card";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { validateMetaData } from "@hypercerts-org/sdk";
import { useEffect, useState } from "react";

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

  useEffect(() => {
    const getHypercertMetadata = async (uri: string) => {
      const response = await client?.storage.getMetadata(uri);
      const { data, valid, errors } = validateMetaData(response);
      if (valid) {
        return data;
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

  return (
    <>
      <main className="flex flex-col p-8 md:p-24 pb-24">
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

        <div className="p-3"></div>
        <div className="flex flex-wrap gap-5">
          {hypercerts.map((hypercert) => (
            <HypercertCard {...hypercert} key={hypercert.hypercertId} />
          ))}
        </div>
      </main>
    </>
  );
}
