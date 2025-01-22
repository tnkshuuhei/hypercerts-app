"use client";

import React, { useState } from "react";

import { formatDate } from "@/lib/utils";
import { CreatorFeed } from "./creator-feed";
import { ShowMoreButton } from "./show-more-button";
import { AttestationResult } from "@/attestations/fragments/attestation-list.fragment";
interface CreatorFeedListProps {
  CreatorFeedData: {
    count: number;
    data: AttestationResult[];
  };
}
export function CreatorFeedLists({ CreatorFeedData }: CreatorFeedListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const latestAttestation = CreatorFeedData?.data[0];

  return (
    <>
      {!isExpanded ? (
        <div className="flex flex-col gap-2 md:w-[400px]">
          <CreatorFeed
            cardwidth="md:w-[400px]"
            attestation={latestAttestation}
          />
          <div className="flex justify-end">
            <ShowMoreButton
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto p-4">
            <div className="inline-flex flex-col min-w-full">
              <div className="relative">
                {/* Date labels */}
                <div className="flex gap-4">
                  {CreatorFeedData?.data.map((attestation) => {
                    const date = new Date(
                      Number(attestation.creation_block_timestamp) * 1000,
                    );
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
                    {CreatorFeedData?.data.map((attestation) => (
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
          <div className="flex justify-center my-3">
            <ShowMoreButton
              isExpanded={isExpanded}
              setIsExpanded={setIsExpanded}
            />
          </div>
        </>
      )}
    </>
  );
}
