import { getCreatorFeedAttestations } from "@/attestations/getCreatorFeedAttestation";
import { CREATOR_FEED_SCHEMA_UID } from "@/configs/eas";
import React from "react";
import { getAddress } from "viem";
import { CreatorFeedLists } from "./creator-feed-lists";
import { InfoSection } from "../global/sections";

function CreatorFeedsNoResults() {
  return "The creator has not published additional information.";
}

function CreatorFeedsLoadError() {
  return <InfoSection>We couldn&apos;t find any creator feeds...</InfoSection>;
}
export default async function CreatorFeeds({
  hypercertId,
}: {
  hypercertId: string;
}) {
  const [chainId, contractAddress, tokenId] = hypercertId.split("-");

  const creatorFeeds = await getCreatorFeedAttestations({
    filter: {
      chainId: BigInt(chainId),
      contractAddress: getAddress(contractAddress),
      tokenId: BigInt(tokenId),
      schemaId: CREATOR_FEED_SCHEMA_UID,
    },
  });

  if (!creatorFeeds || creatorFeeds.data.length === 0) {
    return <CreatorFeedsNoResults />;
  }

  if (!creatorFeeds) {
    return <CreatorFeedsLoadError />;
  }

  if (!creatorFeeds.count || creatorFeeds.count === 0) {
    return <CreatorFeedsNoResults />;
  }

  return <CreatorFeedLists CreatorFeedData={creatorFeeds} />;
}
