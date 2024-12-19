import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DecodedAttestation } from "@/attestations/getCreatorFeedAttestation";
import FormattedDate from "../formatted-date";
import CreatorFeedDescription from "./creator-feed-description";
import Source from "./source";

export function CreatorFeed({
  attestation,
  cardwidth,
}: {
  attestation: DecodedAttestation;
  cardwidth?: string;
}) {
  const parseSourceLinks = () => {
    return attestation.sources.map((source) => {
      return JSON.parse(source);
    });
  };

  const parsedSources = parseSourceLinks();

  return (
    <div className="space-y-4">
      <Card className={`${cardwidth || "w-full"}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-start mb-4 gap-2">
            <FormattedDate seconds={attestation.timeCreated} />
            <h3 className="text-lg font-semibold">{attestation.title}</h3>
            <CreatorFeedDescription comments={attestation.description} />
          </div>

          {attestation.sources && attestation.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Sources
              </h4>
              <div>
                {parsedSources.map((source, index) => (
                  <Source key={index} type={source.type} src={source.src} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
