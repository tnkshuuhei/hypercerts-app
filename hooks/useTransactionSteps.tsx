import { DialogStep, StepState } from "@/components/global/transaction-dialog";
import { useState } from "react";

export function useTransactionSteps(initialSteps: DialogStep[]) {
  const [txnSteps, setTxnSteps] = useState<DialogStep[]>(initialSteps);

  const updateTxnStep = (
    stepId: string,
    errorMessage?: string,
    newState?: StepState,
  ) => {
    setTxnSteps((prevSteps) =>
      prevSteps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              state: newState ? newState : errorMessage ? "error" : "active",
              errorMessage,
            }
          : prevSteps.indexOf(step) <
              prevSteps.findIndex((s) => s.id === stepId)
            ? { ...step, state: "completed" }
            : { ...step, state: "idle" },
      ),
    );
  };

  const resetTxnSteps = () => {
    setTxnSteps(initialSteps);
  };

  return { txnSteps, updateTxnStep, resetTxnSteps };
}
