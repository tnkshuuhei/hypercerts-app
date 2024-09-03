import { EvaluationData } from "@/eas/types/evaluation-data.type";

export type EvaluationStatus =
  | "unverified"
  | "verified"
  | "disputed"
  | "conflicting";

function countEvaluationValue(data: EvaluationData, value: number): number {
  let count = 0;
  if (data.evaluate_basic === value) {
    count++;
  }
  if (data.evaluate_work === value) {
    count++;
  }
  if (data.evaluate_contributors === value) {
    count++;
  }
  return count;
}

export type HypercertAttestations = {
  data:
    | {
        data: unknown;
      }[]
    | null;
  count: number | null;
} | null;

export function getEvaluationStatus(
  hypercertAttestations: HypercertAttestations,
): EvaluationStatus {
  if (!hypercertAttestations || hypercertAttestations.count === 0) {
    return "unverified";
  }

  const attestations = hypercertAttestations.data;

  if (!attestations || attestations.length === 0) {
    return "unverified";
  }

  let evaluationStatus: EvaluationStatus = "unverified";

  // 0 = unverified
  // 1 = verified
  // 2 = disputed
  for (const attestation of attestations) {
    const data: EvaluationData = attestation.data as EvaluationData;

    // All fields approved
    if (countEvaluationValue(data, 1) === 3) {
      if (evaluationStatus === "unverified") {
        evaluationStatus = "conflicting";
        break;
      }
      evaluationStatus = "verified";
      continue;
    }

    // All fields not approved
    if (countEvaluationValue(data, 2) === 3) {
      if (evaluationStatus === "verified") {
        evaluationStatus = "conflicting";
        break;
      }
      evaluationStatus = "unverified";
      continue;
    }

    // At least one field approved AND at least one field not approved
    if (
      countEvaluationValue(data, 1) > 0 &&
      countEvaluationValue(data, 2) === 0
    ) {
      evaluationStatus = "conflicting";
      break;
    }

    // At least one field approved
    if (countEvaluationValue(data, 1) > 0) {
      if (evaluationStatus === "verified") {
        continue;
      }
      evaluationStatus = "conflicting";
    }

    // At least one field not approved
    if (countEvaluationValue(data, 2) > 0) {
      if (evaluationStatus === "unverified") {
        continue;
      }
      evaluationStatus = "conflicting";
    }
  }

  return evaluationStatus;
}
