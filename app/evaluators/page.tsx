import EvaluatorsList from "../../components/evaluators/evaluators-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Evaluators",
  description:
    "Hypercerts trusted evaluators attest to the correctness of hypercerts.",
};

export default async function EvaluatorsPage({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const currentPage = Number(searchParams?.p) || 1;

  return (
    <main className="flex flex-col p-8 md:p-24 pb-24 space-y-4">
      <section>
        <h1 className="font-serif text-3xl lg:text-5xl tracking-tight">
          Evaluators
        </h1>
        <EvaluatorsList searchParams={searchParams} />
      </section>
    </main>
  );
}
