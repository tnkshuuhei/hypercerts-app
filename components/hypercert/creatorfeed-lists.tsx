import React from "react";
import { CreatorFeed } from "./creatorfeed";
import { DecodedAttestation } from "@/attestations/getCreatorFeedAttestation";

export function CreatorFeedLists({ data }: { data: DecodedAttestation[] }) {
  return (
    <div className="grid grid-cols-3 gap-4">
      {data.length === 0 && (
        <div>The creator has not published additional information.</div>
      )}
      {data.map((attestation) => (
        <CreatorFeed key={attestation.id} attestation={attestation} />
      ))}
    </div>
  );
}
