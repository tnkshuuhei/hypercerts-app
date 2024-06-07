import {
  GetAllHypercertsParams,
  getAllHypercerts,
  isClaimsOrderBy,
} from "@/hypercerts/getAllHypercerts";
import HypercertMiniDisplay, {
  HypercertMiniDisplayProps,
} from "@/components/hypercert-mini-display";

import { HYPERCERTS_PER_PAGE } from "@/configs/ui";
import Pagination from "@/components/explore/pagination";
import { Suspense } from "react";

function HypercertsListSkeleton() {
  return (
    <div className="flex justify-center md:justify-start flex-wrap gap-5">
      {Array.from({ length: HYPERCERTS_PER_PAGE }, (_, i) => (
        <div key={i} className="w-[275px] h-[300px] bg-slate-100 rounded-lg" />
      ))}
    </div>
  );
}

async function HypercertsListInner({
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
    <div className="flex flex-col gap-5">
      {search && (
        <div>
          Showing search results for: <b>{search}</b>
        </div>
      )}
      <div className="flex justify-center md:justify-start flex-wrap gap-5">
        {hypercerts?.data?.map((hypercert) => {
          const props: HypercertMiniDisplayProps = {
            hypercertId: hypercert.hypercert_id as string,
            name: hypercert.metadata?.name as string,
          };
          return (
            <HypercertMiniDisplay
              {...props}
              key={hypercert.hypercert_id as string}
            />
          );
        })}
        <Pagination searchParams={searchParams} />
      </div>
    </div>
  );
}

export default async function HypercertsList({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const suspenseKey = new URLSearchParams(searchParams).toString();
  return (
    <Suspense fallback={<HypercertsListSkeleton />} key={suspenseKey}>
      <HypercertsListInner {...{ searchParams }} />
    </Suspense>
  );
}
