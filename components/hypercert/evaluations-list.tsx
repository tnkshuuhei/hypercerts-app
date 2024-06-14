import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";

export default async function EvaluationsList({
  hypercert,
}: {
  hypercert: HypercertFull;
}) {
  const attestations = hypercert.attestations?.data;

  if (!attestations) {
    return <div>No attestations found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {attestations.map((attestation) => (
        <div key={attestation.uid}>
          <div className="flex items-center gap-2">
            <div className="flex-grow">
              <p className="text-sm text-gray-700 font-medium">
                {attestation.attester}
              </p>
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-700 font-medium">
                {attestation.block_timestamp}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
