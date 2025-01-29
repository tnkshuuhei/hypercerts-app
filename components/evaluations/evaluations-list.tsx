import Comments from "@/components/evaluations/evaluation-list-item/comments";
import EnsName from "@/components/ens-name";
import EthAddress from "@/components/eth-address";
import { EvaluationData } from "@/eas/types/evaluation-data.type";
import Evaluations from "@/components/evaluations/evaluation-list-item/evaluations";
import FormattedDate from "@/components/formatted-date";
import Link from "next/link";
import Tags from "@/components/evaluations/evaluation-list-item/tags";
import { UserIcon } from "@/components/user-icon";
import type { AttestationResult } from "@/attestations/fragments/attestation-list.fragment";

import { formatDate } from "@/lib/utils";

interface EvaluationsListProps {
  initialEvaluations: {
    count: number;
    data: AttestationResult[];
  };
}

export default function EvaluationsList({
  initialEvaluations,
}: EvaluationsListProps) {
  if (initialEvaluations.data.length === 0) {
    return <div>This Hypercert has not yet been evaluated.</div>;
  }

  return (
    <div className="overflow-x-auto p-4">
      <div className="inline-flex flex-col min-w-full">
        <div className="relative">
          {/* Date labels */}
          <div className="flex gap-4">
            {initialEvaluations?.data.map((attestation) => {
              const date = new Date(
                Number(attestation.creation_block_timestamp) * 1000,
              );
              const formattedDate = formatDate(date.toString());
              return (
                <div
                  key={`date-${attestation.id}`}
                  className="flex-none w-[300px]"
                >
                  <div className="text-sm text-gray-500 text-center mb-2">
                    {formattedDate}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Timeline and cards */}
          <div className="relative">
            {/* Timeline bar */}
            <div className="absolute top-[7px] left-0 right-0 h-[2px] bg-gray-200" />

            {/* Circles and cards */}
            <div className="flex gap-4">
              {initialEvaluations?.data.map((attestation) => {
                if (!attestation) return null;
                const data = attestation.data as EvaluationData;
                const attester = attestation.attester;

                if (!attester) return null;

                return (
                  <div key={attestation.uid} className="flex-none w-[300px]">
                    <div className="relative mb-4">
                      <div className="flex justify-center">
                        <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300" />
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-[300px] p-4 flex flex-col gap-2 rounded-lg border border-slate-200">
                      <FormattedDate
                        seconds={attestation.creation_block_timestamp}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <UserIcon address={attester} size="large" />
                        <div className="flex flex-col justify-center items-start overflow-hidden">
                          <Link href={`/evaluators/${attestation.attester}`}>
                            <EnsName
                              address={attester}
                              className="text-sm font-semibold truncate hover:underline"
                            />
                          </Link>
                          <EthAddress
                            address={attester}
                            className="text-xs text-slate-500 truncate"
                          />
                        </div>
                      </div>
                      <Evaluations
                        basic={data.evaluate_basic}
                        work={data.evaluate_work}
                        properties={data.evaluate_properties}
                        contributors={data.evaluate_contributors}
                      />
                      <Tags tags={data.tags} />
                      <div className="mt-2 flex-grow">
                        <Comments comments={data.comments} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
