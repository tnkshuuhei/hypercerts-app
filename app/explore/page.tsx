"use client";

import { Button } from "@/components/ui/button";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { validateMetaData } from "@hypercerts-org/sdk";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

// export const metadata = {
//   title: "Explore",
//   description:
//     "The best place to discover and contribute to hypercerts and hyperboards.",
// };

export default function Explore() {
  const { client } = useHypercertClient();
  const [loading, setLoading] = useState(true);

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
      let hypercerts;
      try {
        const response = await client?.indexer.recentHypercerts({ first: 10 });
        const hypercertData = response?.hypercerts.data;
        if (hypercertData) {
          hypercerts = await Promise.all(
            hypercertData.map(async (hypercert) => {
              if (hypercert.uri) {
                const metadata = await getHypercertMetadata(hypercert.uri);
                return metadata;
              }
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch recent hypercerts:", error);
        hypercerts = [];
      }
      setLoading(false);
      console.log(hypercerts);
      return hypercerts;
    };
    getHypercerts();
  }, [client]);

  return (
    <>
      <main className="flex flex-col p-8 md:p-24 pb-24">
        <section>
          <h1 className="font-serif text-5xl lg:text-8xl tracking-tight">
            Explore
          </h1>
          <div className="p-1"></div>
          <p className="md:text-lg">
            The best place to discover and contribute to hypercerts and
            hyperboards.
          </p>
        </section>

        <div className="p-3"></div>
        <section className="flex flex-col space-y-2">
          <Link href="/explore/hypercerts" className="group">
            <article className="p-3 border-[1.5px] border-border rounded-md flex flex-col space-y-2">
              <h2 className="text-2xl lg:text-4xl tracking-tight font-medium">
                Hypercerts
              </h2>
              <p>
                Hypercerts publicly represent specific works and their impact,
                allowing projects to issue and distribute them to contributors
                on-chain.
              </p>
              <Button className="flex space-x-2" variant="outline">
                Explore hypercerts
                <ArrowRight
                  size={18}
                  className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 transition-transform duration-300 ease-in-out"
                  aria-hidden="true"
                />
              </Button>
            </article>
          </Link>
        </section>
      </main>
    </>
  );
}
