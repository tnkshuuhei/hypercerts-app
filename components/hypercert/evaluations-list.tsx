import Comments from "../evaluation-list-item/comments";
import EnsName from "../ens-name";
import EthAddress from "../eth-address";
import { EvaluationData } from "../../eas/types/evaluation-data.type";
import Evaluations from "../evaluation-list-item/evaluations";
import FormattedDate from "../formatted-date";
import Link from "next/link";
import Tags from "../evaluation-list-item/tags";
import { UserIcon } from "../user-icon";
import type { AttestationResult } from "@/attestations/fragments/attestation-list.fragment";

interface EvaluationsListProps {
  initialEvaluations: {
    count: number;
    data: AttestationResult[];
  };
}

export default async function EvaluationsList({
  initialEvaluations,
}: EvaluationsListProps) {
  if (initialEvaluations.data.length === 0) {
    return <div>This Hypercert has not yet been evaluated.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {initialEvaluations.data.map((attestation, index) => {
        if (!attestation) return null;
        const data = attestation.data as EvaluationData;
        const attester = attestation.attester;

        if (!attester) return null;

        return (
          <div
            key={attestation.uid}
            className="p-5 flex flex-col gap-5 rounded-lg border-[1.5px] border-slate-200 h-[500px] overflow-hidden"
          >
            <FormattedDate seconds={attestation.creation_block_timestamp} />

            <Link
              href={`/evaluators/${attestation.attester}`}
              className="w-full"
            >
              <div className="flex gap-2 w-full">
                <UserIcon address={attester} size="large" />
                <div className="flex flex-col justify-center items-start w-52">
                  <EnsName address={attester} />
                  <EthAddress address={attester} />
                </div>
              </div>
            </Link>
            <div className="flex-grow overflow-y-auto space-y-4">
              <Evaluations
                basic={data.evaluate_basic}
                work={data.evaluate_work}
                properties={data.evaluate_properties}
                contributors={data.evaluate_contributors}
              />
              <Tags tags={data.tags} />
              <Comments comments={data.comments} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
