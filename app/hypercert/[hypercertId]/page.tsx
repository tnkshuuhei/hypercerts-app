import Contributors from "@/components/hypercert/contributors";
import CreatedDate from "@/components/hypercert/created-date";
import Creator from "@/components/hypercert/creator";
import ExternalUrl from "@/components/hypercert/external-url";
import Fractions from "@/components/hypercert/fractions";
import WorkScope from "@/components/hypercert/scope";
import WorkTimeFrame from "@/components/hypercert/time-frame";
import ReadMore from "@/components/read-more";
import { Separator } from "@/components/ui/separator";
import { getHypercert } from "@/hypercerts/getHypercert";

export default async function HypercertPage({
  params,
}: {
  params: { hypercertId: string };
}) {
  const { hypercertId } = params;
  const hypercert = await getHypercert(hypercertId);

  if (!hypercert) {
    throw new Error("Hypercert not found.");
  }

  return (
    <main className="flex flex-col p-8 md:p-24 pb-24 space-y-4">
      <section className="flex flex-col space-y-4">
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          {hypercert?.metadata?.name}
        </h1>
        <ReadMore text={hypercert?.metadata?.description} length={280} />
        <ExternalUrl url={hypercert?.metadata?.external_url} />
        <Separator />
        <div className="flex">
          <WorkTimeFrame hypercert={hypercert} />
          <WorkScope hypercert={hypercert} />
        </div>
        <Separator />
        <div className="flex">
          <Creator hypercert={hypercert} />
          <CreatedDate hypercert={hypercert} />
        </div>
        <Separator />
        <Contributors hypercert={hypercert} />
        <Separator />
        <Fractions hypercert={hypercert} />
      </section>
    </main>
  );
}
