import HypercertCard, {
  type HypercertCardProps,
} from "@/components/hypercert-card";
import { getAllHypercerts } from "../../hypercerts/getAllHypercerts";
import Pagination from "../../components/explore/Pagination";
import { HYPERCERTS_PER_PAGE } from "../../configs/ui";
import { Suspense } from "react";
import Loading from "./loading";

export const metadata = {
  title: "Explore",
  description:
    "The best place to discover and contribute to hypercerts and hyperboards.",
};

async function ExplorePageInner({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const currentPage = Number(searchParams?.p) || 1;

  const hypercerts = await getAllHypercerts({
    first: HYPERCERTS_PER_PAGE,
    offset: HYPERCERTS_PER_PAGE * (currentPage - 1),
  });

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

        <div className="p-3"></div>
        <div className="flex flex-wrap gap-5">
          {hypercerts?.data?.map((hypercert) => {
            const props: HypercertCardProps = {
              hypercertId: hypercert.hypercert_id as string,
              title: hypercert.metadata?.name as string,
              description: hypercert.metadata?.description as string,
            };
            return <HypercertCard {...props} key={hypercert.hypercert_id} />;
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
