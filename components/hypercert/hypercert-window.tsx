import { Separator } from "@/components/ui/separator";
import { getEvaluationStatus } from "@/hypercerts/getEvaluationStatus";
import { supportedChains, type SupportedChainIdType } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

export type HypercertMiniDisplayProps = {
  hypercertId: string;
  name: string;
  chainId: SupportedChainIdType;
  fromDateDisplay?: string | null;
  toDateDisplay?: string | null;
  attestations: {
    data:
      | {
          data: unknown;
        }[]
      | null;
    count: number | null;
  } | null;
  hasTrustedEvaluator?: boolean;
  percentAvailable?: number;
  lowestPrice?: string;
};

const HypercertWindow = ({
  hasTrustedEvaluator,
  percentAvailable,
  lowestPrice,
  hypercertId,
  name,
  chainId,
  attestations,
}: HypercertMiniDisplayProps) => {
  const cardChain = (chainId: SupportedChainIdType) => {
    return supportedChains.find((x) => x.id === chainId)?.name;
  };

  const evaluationStatus = getEvaluationStatus(attestations);

  return (
    <Link href={`/hypercerts/${hypercertId}`}>
      <article className="transition-transform duration-300 hover:-translate-y-2 rounded-md relative overflow-hidden group">
        <div className="h-[320px] min-w-[300px] max-w-[350px]">
          <div className="relative w-full h-full bg-black overflow-hidden">
            <Image
              src={`/api/hypercerts/${hypercertId}/image`}
              alt={name || "Untitled"}
              fill
              className="object-contain object-center p-4"
            />
          </div>
        </div>
        <section className="absolute top-4 left-4 flex space-x-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-out">
          <div className="rounded-md px-2 py-0.5 bg-black border border-white/60 text-white text-xs">
            {cardChain(chainId)}
          </div>
          <div className="rounded-md px-2 py-0.5 bg-black border border-white/60 text-white text-xs">
            {evaluationStatus}
          </div>
        </section>
        <section className="bg-black/70 backdrop-blur-sm absolute bottom-0 w-full p-4 text-white space-y-2">
          <p
            className={`flex-1 text-sm font-medium line-clamp-2 text-ellipsis ${
              name ? "text-white" : "text-slate-100"
            }`}
          >
            {name || "[Untitled]"}
          </p>
          <Separator className="border-white my-2 opacity-40" />
          <section className="flex text-xs justify-between">
            <section>
              <h6 className="opacity-70">for sale</h6>
              <p> {percentAvailable ? `${percentAvailable}%` : "--"}</p>
            </section>
            <section>
              <h6 className="text-end opacity-70">lowest per %</h6>
              <p className="font-medium">
                {lowestPrice ? lowestPrice : "--"} ETH
              </p>
            </section>
          </section>
        </section>
      </article>
    </Link>
  );
};

export { HypercertWindow as default };
