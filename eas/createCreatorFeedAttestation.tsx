import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { CREATOR_FEED_SCHEMA, CREATOR_FEED_SCHEMA_UID } from "@/configs/eas";

import { JsonRpcSigner } from "ethers";
import { getEasConfig } from "./getEasConfig";
import { CreatorFeedFormValues } from "@/components/creator-feed/creator-feed-drawer";

export async function createCreatorFeedAttestation(
  data: CreatorFeedFormValues,
  rpcSigner: JsonRpcSigner,
) {
  const easConfig = getEasConfig(Number(data.chainId));
  if (!easConfig) {
    throw new Error("EAS config not found");
  }

  // Initialize EAS API with the EAS contract address
  const eas = new EAS(easConfig.address);
  eas.connect(rpcSigner);

  // Initialize SchemaEncoder with the schema string
  const schemaEncoder = new SchemaEncoder(CREATOR_FEED_SCHEMA);

  // Stringify the sources
  const sources = [
    // stringified links
    ...(data.links?.map((link) =>
      JSON.stringify({
        type: link.type,
        src: link.src,
      }),
    ) || []),
    // stringified files
    ...(data.documents?.map((doc) =>
      JSON.stringify({
        type: doc.type,
        name: doc.name,
        src: doc.src,
      }),
    ) || []),
  ];
  // Encode the data according to schema
  const encodedData = schemaEncoder.encodeData([
    { name: "chain_id", value: BigInt(data.chainId), type: "uint256" },
    { name: "contract_address", value: data.contractAddress, type: "address" },
    { name: "token_id", value: BigInt(data.tokenId), type: "uint256" },
    { name: "title", value: data.title, type: "string" },
    { name: "description", value: data.description, type: "string" },
    { name: "sources", value: sources, type: "string[]" },
  ]);

  const tx = await eas.attest({
    schema: CREATOR_FEED_SCHEMA_UID,
    data: {
      recipient: "0x0000000000000000000000000000000000000000",
      expirationTime: BigInt(0),
      revocable: false,
      data: encodedData,
      refUID:
        data.ref ||
        "0x0000000000000000000000000000000000000000000000000000000000000000",
    },
  });

  const uid = await tx.wait();
  return {
    tx,
    uid,
  };
}
