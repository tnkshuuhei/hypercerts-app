import WorkScope from "../../../components/hypercert/scope";
import WorkTimeFrame from "../../../components/hypercert/time-frame";
import { getHypercert } from "../../../hypercerts/getHypercert";

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
        <p className="md:text-lg">{hypercert?.metadata?.description}</p>
        <div className="flex">
          <WorkTimeFrame hypercert={hypercert} />
          <WorkScope hypercert={hypercert} />
        </div>
      </section>
    </main>
  );
}
