import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";
import { CREATOR_FEED_SCHEMA, CREATOR_FEED_SCHEMA_UID } from "@/configs/eas";

import { JsonRpcSigner } from "ethers";
import { getEasConfig } from "./getEasConfig";
import { CreatorFeedFormValues } from "@/components/hypercert/creatorfeed-drawer";

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

  // Stringify the links
  const stringifiedLinks = data.links.map((link) =>
    JSON.stringify({
      type: link.type,
      src: link.src,
    }),
  );

  // Encode the data according to schema
  const encodedData = schemaEncoder.encodeData([
    { name: "chainId", value: BigInt(data.chainId), type: "uint256" },
    { name: "contractAddress", value: data.contractAddress, type: "address" },
    { name: "tokenId", value: BigInt(data.tokenId), type: "uint256" },
    { name: "title", value: data.title, type: "string" },
    { name: "description", value: data.description, type: "string" },
    { name: "sources", value: stringifiedLinks, type: "string[]" },
    {
      name: "ref",
      value:
        // refUID: data.ref // TODO: add refUID
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      type: "bytes32",
    },
  ]);

  const tx = await eas.attest({
    schema: CREATOR_FEED_SCHEMA_UID,
    data: {
      recipient: rpcSigner.address, // TODO: who receives the attestation?
      expirationTime: BigInt(0),
      revocable: false,
      data: encodedData,
      // refUID: data.ref // TODO: add refUID
    },
  });

  const uid = await tx.wait();
  return {
    tx,
    uid,
  };
}