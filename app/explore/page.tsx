import { ComboSelect } from "@/components/combobox";
import HypercertMiniDisplay from "@/components/hypercert-mini-display";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  GetAllHypercertsParams,
  getAllHypercerts,
  isClaimsOrderBy,
} from "../../hypercerts/getAllHypercerts";
import Pagination from "../../components/explore/Pagination";
import { HYPERCERTS_PER_PAGE } from "../../configs/ui";
import { Suspense } from "react";
import Loading from "./loading";
import ChainFilterSelect from "../../components/explore/ChainFilterSelect";
import SearchBar from "../../components/explore/SearchBar";
import OrderBySelect from "../../components/explore/OrderBySelect";

async function ExplorePageInner({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const currentPage = Number(searchParams?.p) || 1;
  const chainId = Number(searchParams?.chain);
  const search = searchParams?.search;
  const orderBy = searchParams?.orderBy;
  const params: GetAllHypercertsParams = {
    first: HYPERCERTS_PER_PAGE,
    offset: HYPERCERTS_PER_PAGE * (currentPage - 1),
  };
  if (chainId) {
    params.chainId = chainId;
  }
  if (search) {
    params.search = search;
  }
  if (isClaimsOrderBy(orderBy)) {
    params.orderBy = orderBy;
  }
  const hypercerts = await getAllHypercerts(params);

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
          <SearchBar />
          <ChainFilterSelect />
          <OrderBySelect />
        </section>
        {search && (
          <div>
            Showing search results for: <b>{search}</b>
          </div>
        )}
        <div className="flex justify-center md:justify-start flex-wrap gap-5">
          {hypercerts?.data?.map((hypercert) => {
            return (
              <HypercertMiniDisplay
                hypercert={hypercert}
                key={hypercert.hypercertId}
              />
            );
          })}
        </div>
        <Pagination searchParams={searchParams} />
      </main>
    </>
  );
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  return (
    <Suspense fallback={<Loading />}>
      {ExplorePageInner({ searchParams })}
    </Suspense>
  );
}
