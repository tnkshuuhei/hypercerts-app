"use client";
import {
  type DialogStep,
  type StepData,
  StepProcessDialogProvider,
  useStepProcessDialogContext,
} from "@/components/global/step-process-dialog";
import React, {
  createContext,
  type ReactNode,
  useContext,
  useState,
} from "react";
import { toast } from "sonner";
import { useAccount, useConfig } from "wagmi";

export type TransactionStatus =
  | "pending"
  | "processing"
  | "success"
  | "failed"
  | null;

interface TransactionContextType {
  sendTransaction: ({
    txnTitle,
    txnFn,
  }: {
    txnTitle: string;
    txnFn: () => Promise<any>;
  }) => Promise<void>;
  txnStatus: TransactionStatus;
  txnLabel: string;
  isProcessing: boolean;
  error: string | null;
  setTransactionSteps: (steps: StepData[]) => void;
  setCurrentStep: (step: DialogStep["id"]) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(
  undefined,
);

export const useTransaction = (): TransactionContextType => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error("useTransaction must be used within a TransactionProvider");
  }
  return context;
};

interface TransactionProviderProps {
  children: ReactNode;
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
  children,
}) => {
  const [txnStatus, setTxnStatus] = useState<TransactionStatus>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [txnLabel, setTxnLabel] = useState("Transaction");
  const {
    setSteps,
    setDialogStep: setStep,
    setOpen,
  } = useStepProcessDialogContext();

  const { isConnected, chain } = useAccount();
  const { chains } = useConfig();

  const checkNetwork = (): boolean => {
    if (!isConnected) {
      setError("Please connect your wallet");
      return false;
    }
    if (!chains.some((c) => c.id === chain?.id)) {
      setError("Please switch to a supported network");
      return false;
    }
    return true;
  };

  const sendTransaction = async (
    transactionFunction: () => Promise<any>,
  ): Promise<void> => {
    if (!checkNetwork) return;

    setIsProcessing(true);
    setTxnStatus("pending");
    setError(null);

    try {
      const txn = await transactionFunction();
      setTxnStatus("processing");
      await txn.wait();
      setTxnStatus("success");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setTxnStatus("failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const emitToastError = (error: string) =>
    toast.error("Transaction error", { description: error });

  const contextValue: TransactionContextType = {
    sendTransaction: ({ txnTitle, txnFn }) => {
      setTxnLabel(txnTitle);
      return sendTransaction(txnFn);
    },
    txnStatus,
    txnLabel,
    isProcessing,
    error,
    setTransactionSteps: (steps: StepData[]) => {
      setSteps(steps);
      setOpen(true);
    },
    setCurrentStep: (step: DialogStep["id"]) => {
      setStep(step);
    },
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      <StepProcessDialogProvider>
        {children}
        {error && <div>Error: {error}</div>}
      </StepProcessDialogProvider>
    </TransactionContext.Provider>
  );
};
