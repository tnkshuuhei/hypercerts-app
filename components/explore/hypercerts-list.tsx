import {
  GetAllHypercertsParams,
  getAllHypercerts,
  isClaimsOrderBy,
} from "@/hypercerts/getAllHypercerts";
import HypercertMiniDisplay, {
  HypercertMiniDisplayProps,
} from "@/components/hypercert-mini-display";

import { HYPERCERTS_PER_PAGE } from "@/configs/ui";
import HypercertsListSkeleton from "./hypercerts-list-skeleton";
import Pagination from "@/components/explore/pagination";
import PaginationSkeleton from "./pagination-skeleton";
import { Suspense } from "react";

function HypercertsListNoResults() {
  return "No results found";
}

function HypercertsListLoadError() {
  return "Unable to load hypercerts";
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

  if (!hypercerts) {
    return <HypercertsListLoadError />;
  }

  if (!hypercerts.count || hypercerts.count === 0) {
    return <HypercertsListNoResults />;
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {search && (
          <div>
            Showing search results for: <b>{search}</b>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
        </div>
      </div>
      <Pagination
        searchParams={searchParams}
        hypercertsCount={hypercerts.count}
      />
    </>
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
