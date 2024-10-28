import { Metadata, ResolvingMetadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";

import { getHypercert } from "@/hypercerts/getHypercert";
import { getOrders } from "@/marketplace/getOpenOrders";

import { CurrencyButtons } from "@/components/currency-buttons";
import { Separator } from "@/components/ui/separator";
import PageSkeleton from "@/components/hypercert/page-skeleton";
import ReadMore from "@/components/read-more";
import { ListForSaleButton } from "@/components/marketplace/list-for-sale-button";

const Contributors = dynamic(
  () => import("@/components/hypercert/contributors"),
);
const Creator = dynamic(() => import("@/components/hypercert/creator"));
const EvaluateButton = dynamic(
  () => import("@/components/hypercert/evaluate-button"),
);
const EvaluationsList = dynamic(
  () => import("@/components/hypercert/evaluations-list"),
);
const ExternalUrl = dynamic(
  () => import("@/components/hypercert/external-url"),
);
const Fractions = dynamic(() => import("@/components/hypercert/fractions"));
const WorkScope = dynamic(() => import("@/components/hypercert/scope"));
const TimeFrame = dynamic(() => import("@/components/hypercert/time-frame"));
const HypercertListingsList = dynamic(
  () => import("@/components/marketplace/hypercert-listings-list"),
);
const MutationButtons = dynamic(
  () => import("@/components/hypercert/mutation-buttons"),
);

type Props = {
  params: { hypercertId: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { hypercertId } = params;
  const hypercert = await getHypercert(hypercertId);

  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: hypercert?.metadata?.name || "Untitled Hypercert",
    description: hypercert?.metadata?.description || "",
    openGraph: {
      images: [
        `/api/hypercerts/${hypercertId}/image`,
        "/hypercerts-opengraph.jpg",
        ...previousImages,
      ],
    },
  };
}

function ErrorState({ hypercertId }: { hypercertId: string }) {
  return (
    <section className="flex flex-col space-y-4">
      <section className="space-y-4 lg:flex lg:space-y-0 lg:space-x-8">
        <div className="flex justify-between">
          <h2 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
            Oops! Something went wrong...
          </h2>
        </div>
      </section>
      <section className="flex flex-col space-y-4">
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          Hypercert not found.
        </h1>
        <Separator />
        <pre className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          {`ID: ${hypercertId}`}
        </pre>
        <p className="md:text-lg">
          If this hypercert was freshly minted try refreshing in 30 seconds.
          Please try again or contact us at{" "}
          <a href="mailto:support@hypercerts.org">support@hypercerts.org</a>.
        </p>
      </section>
    </section>
  );
}

function HypercertImage({
  hypercertId,
  name,
}: {
  hypercertId: string;
  name: string;
}) {
  return (
    <div className="h-[300px] lg:h-[350px] min-w-[300px] lg:min-w-[500px] max-w-[500px] flex flex-col">
      <div className="relative w-full flex-grow bg-accent border border-slate-300 rounded-lg overflow-hidden">
        <Image
          src={`/api/hypercerts/${hypercertId}/image`}
          alt={name || ""}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain object-top p-2"
        />
      </div>
    </div>
  );
}

async function HypercertPageInner({ params }: Props) {
  const { hypercertId } = params;
  const hypercert = await getHypercert(hypercertId);
  const orders = await getOrders({
    filter: {
      hypercertId,
    },
  });

  if (!hypercert) {
    return <ErrorState hypercertId={hypercertId} />;
  }

  return (
    <section className="flex flex-col space-y-4">
      <article className="space-y-4 lg:flex lg:space-y-0 lg:space-x-6">
        <HypercertImage
          hypercertId={hypercertId}
          name={hypercert?.metadata?.name || ""}
        />
        <section className="space-y-4 w-full">
          <div className="flex flex-row w-full align-center justify-between">
            <h1 className="font-serif text-3xl lg:text-4xl tracking-tight line-clamp-2 text-ellipsis">
              {hypercert?.metadata?.name || "[Untitled]"}
            </h1>
            <MutationButtons hypercert={hypercert} />
          </div>
          <Creator hypercert={hypercert} />
          <ReadMore text={hypercert?.metadata?.description} length={280} />
          <ExternalUrl url={hypercert?.metadata?.external_url} />
          {(hypercert?.metadata?.work_timeframe_from as string) && (
            <>
              <Separator />
              <h2 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
                TIME OF WORK
              </h2>
              <TimeFrame
                from={hypercert.metadata?.work_timeframe_from}
                to={hypercert.metadata?.work_timeframe_to}
              />
            </>
          )}
        </section>
      </article>

      <Separator />
      <section className="space-y-4 lg:flex lg:space-y-0 lg:space-x-8">
        {hypercert?.metadata?.contributors && (
          <Contributors hypercert={hypercert} />
        )}
        <Fractions hypercert={hypercert} />
      </section>
      {hypercert?.metadata?.work_scope && (
        <>
          <Separator />
          <WorkScope hypercert={hypercert} />
        </>
      )}
      <Separator />
      <div className="flex justify-between">
        <h2 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          Evaluations
        </h2>
        <EvaluateButton hypercert={hypercert} />
      </div>
      <EvaluationsList hypercert={hypercert} />
      <Separator />
      <div className="flex justify-between">
        <h2 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          Marketplace
        </h2>
        <div className="flex gap-2">
          <CurrencyButtons />
          <ListForSaleButton hypercert={hypercert} />
        </div>
      </div>
      <HypercertListingsList hypercert={hypercert} orders={orders?.data} />
    </section>
  );
}

export default async function HypercertPage({ params }: Props) {
  return (
    <main className="flex flex-col p-8 md:px-24 md:pt-14 pb-24 space-y-4 flex-1">
      <Suspense fallback={<PageSkeleton />} key={params.hypercertId}>
        <HypercertPageInner params={params} />
      </Suspense>
    </main>
  );
}
