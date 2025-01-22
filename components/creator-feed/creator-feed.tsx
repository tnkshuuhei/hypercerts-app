import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import FormattedDate from "../formatted-date";
import CreatorFeedDescription from "./creator-feed-description";
import Source from "./source";
import { AttestationResult } from "@/attestations/fragments/attestation-list.fragment";
import { CreatorFeedData } from "@/eas/types/creator-feed.type";

export function CreatorFeed({
  attestation,
  cardwidth,
}: {
  attestation: AttestationResult;
  cardwidth?: string;
}) {
  const data = attestation.data as CreatorFeedData;
  const parseSourceLinks = () => {
    return data?.sources.map((source) => {
      return JSON.parse(source);
    });
  };

  const parsedSources = parseSourceLinks();

  return (
    <div className="space-y-4">
      <Card className={`${cardwidth || "w-full"}`}>
        <CardContent className="p-6">
          <div className="flex flex-col items-start mb-4 gap-2">
            <FormattedDate seconds={attestation.creation_block_timestamp} />
            <h3 className="text-lg font-semibold">{data.title}</h3>
            <CreatorFeedDescription comments={data.description} />
          </div>

          {data.sources && data.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500">Sources</h4>
              <div className="flex flex-col items-start">
                {parsedSources.map((source, index) => (
                  <Source
                    key={index}
                    type={source.type}
                    src={source.src}
                    fileName={source.name}
                  />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
