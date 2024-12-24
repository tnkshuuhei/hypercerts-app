import "server-only";

import { graphql } from "@/lib/graphql";

import request from "graphql-request";
import { CREATOR_FEED_SCHEMA_UID } from "@/configs/eas";
import { getAddress } from "viem";

export interface ReturnedAttestation {
  id: string;
  data: string;
  decodedDataJson: string;
  recipient: string;
  timeCreated: number;
  revoked: boolean;
  schemaId: string;
  expirationTime: number;
  refUID: string;
  time: number;
  revocable: boolean;
  attester: string;
}
export interface AttestationData {
  chain_id: number;
  contract_address: string;
  token_id: number;
  title: string;
  description: string;
  sources: string[];
}

export interface DecodedAttestation
  extends ReturnedAttestation,
    AttestationData {}

const query = graphql(`
  query Attestations($recipient: String!, $schemaId: String!) {
    attestations(
      where: {
        AND: [
          { recipient: { equals: $recipient } }
          { schemaId: { equals: $schemaId } }
        ]
      }
      orderBy: [{ timeCreated: desc }]
    ) {
      id
      data
      decodedDataJson
      recipient
      timeCreated
      revoked
      schemaId
      expirationTime
      refUID
      time
      expirationTime
      revocable
      attester
    }
  }
`);

export async function getCreatorFeedAttestation(
  hypercertId: string,
  recipient: string,
) {
  // const [chainId, contractAddress, tokenId] = hypercertId.split("-");
  const address = getAddress(recipient);

  // TODO: use hypercerts API. just hardcoding for now
  const res = await request("https://sepolia.easscan.org/graphql", query, {
    schemaId: CREATOR_FEED_SCHEMA_UID,
    recipient: "0x0000000000000000000000000000000000000000",
  });

  if (!res.attestations || !Array.isArray(res.attestations)) {
    return {
      data: [],
    };
  }

  return {
    data: res.attestations.map((attestation: ReturnedAttestation) =>
      formatDecodedData(attestation),
    ),
  };
}
function formatDecodedData(item: ReturnedAttestation): DecodedAttestation {
  const decoded = JSON.parse(item.decodedDataJson);
  const formatted: AttestationData = {
    chain_id: decoded[0].value.value,
    contract_address: decoded[1].value.value,
    token_id: decoded[2].value.value,
    title: decoded[3].value.value,
    description: decoded[4].value.value,
    sources: decoded[5].value.value,
  };

  const returnVal: DecodedAttestation = {
    ...item,
    ...formatted,
  };

  return returnVal;
}
