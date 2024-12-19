"use client";

import React, { useState } from "react";

import { DecodedAttestation } from "@/attestations/getCreatorFeedAttestation";
import { Button } from "../ui/button";
import { formatDate } from "@/lib/utils";
import { CreatorFeed } from "./creator-feed";

export function CreatorFeedLists({ data }: { data: DecodedAttestation[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const latestAttestation = data[data.length - 1];

  if (data.length === 0) {
    return <div>The creator has not published additional information.</div>;
  }

  if (data.length < 3) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((attestation) => (
          <CreatorFeed key={attestation.id} attestation={attestation} />
        ))}
      </div>
    );
  }

  return (
    <div>
      <Button
        variant="link"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="text-sm p-0"
      >
        {isExpanded ? "Hide" : "Show more updates"}
      </Button>

      {!isExpanded ? (
        <div className="max-w-lg">
          <CreatorFeed attestation={latestAttestation} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="inline-flex flex-col min-w-full">
            <div className="relative">
              {/* Date labels */}
              <div className="flex gap-4">
                {data.map((attestation) => {
                  const date = new Date(attestation.timeCreated * 1000);
                  const formattedDate = formatDate(date.toString());
                  return (
                    <div
                      key={`date-${attestation.id}`}
                      className="flex-none w-[250px] md:w-[400px]"
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
                  {data.map((attestation) => (
                    <div
                      key={attestation.id}
                      className="flex-none w-[250px] md:w-[400px]"
                    >
                      <div className="relative mb-4">
                        <div className="flex justify-center">
                          <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-300" />
                        </div>
                      </div>
                      <CreatorFeed
                        attestation={attestation}
                        cardwidth="w-[250px] md:w-[400px]"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
