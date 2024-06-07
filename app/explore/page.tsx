import ChainFilterSelect from "@/components/explore/chain-filter-select";
import OrderBySelect from "@/components/explore/order-by-select";
import SearchBar from "@/components/explore/search-bar";
import { Metadata } from "next";
import HypercertsList from "@/components/explore/hypercerts-list";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "The best place to discover and contribute to hypercerts and hyperboards.",
};

export default async function ExplorePageInner({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
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
        <SearchBar />
        <ChainFilterSelect />
        <OrderBySelect />
      </section>
      <div className="flex justify-center md:justify-start flex-wrap gap-5">
        <HypercertsList {...{ searchParams }} />
      </div>
    </main>
  );
}

