import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, Calendar, Link as LinkIcon } from "lucide-react";
import { DecodedAttestation } from "@/attestations/getCreatorFeedAttestation";
import Link from "next/link";

export function CreatorFeed({
  attestation,
}: {
  attestation: DecodedAttestation;
}) {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const parseSourceLinks = (sources: string[]) => {
    return sources.map((source) => {
      try {
        return JSON.parse(source);
      } catch {
        return { type: "url", src: source };
      }
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center text-gray-500 text-sm mb-2">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formatDate(attestation.timeCreated)}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                {attestation.title}
              </h3>
            </div>
          </div>

          <p className="text-gray-600 mb-6">{attestation.description}</p>

          {attestation.sources && attestation.sources.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-gray-500 mb-2">
                Related Links
              </h4>
              <div className="space-y-2">
                {parseSourceLinks(attestation.sources).map((source, index) => (
                  <Link
                    key={index}
                    href={source.src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center group text-blue-600 hover:text-blue-700 text-sm"
                  >
                    <LinkIcon className="h-4 w-4 mr-2" />
                    <span className="truncate flex-1">{source.src}</span>
                    <ArrowUpRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
