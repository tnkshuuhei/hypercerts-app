import { EvaluationData } from "../eas/types/evaluation-data.type";
import { HypercertListFragment } from "./fragments/hypercert-list.fragment";

export type EvaluationStatus =
  | "not-evaluated"
  | "approved"
  | "not-approved"
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

export function getEvaluationStatus(
  hypercert: HypercertListFragment
): EvaluationStatus {
  if (!hypercert.attestations || hypercert.attestations.count === 0) {
    return "not-evaluated";
  }

  const attestations = hypercert.attestations.data;

  if (!attestations || attestations.length === 0) {
    return "not-evaluated";
  }

  let evaluationStatus: EvaluationStatus = "not-evaluated";

  // 0 = not evaluated
  // 1 = approved
  // 2 = not approved
  for (const attestation of attestations) {
    const data: EvaluationData = attestation.data as EvaluationData;

    // All fields approved
    if (countEvaluationValue(data, 1) === 3) {
      if (evaluationStatus === "not-approved") {
        evaluationStatus = "conflicting";
        break;
      }
      evaluationStatus = "approved";
      continue;
    }

    // All fields not approved
    if (countEvaluationValue(data, 2) === 3) {
      if (evaluationStatus === "approved") {
        evaluationStatus = "conflicting";
        break;
      }
      evaluationStatus = "not-approved";
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
      if (evaluationStatus === "approved") {
        continue;
      }
      evaluationStatus = "conflicting";
    }

    // At least one field not approved
    if (countEvaluationValue(data, 2) > 0) {
      if (evaluationStatus === "not-approved") {
        continue;
      }
      evaluationStatus = "conflicting";
    }
  }

  return evaluationStatus;
}
