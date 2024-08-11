import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertCircle, Badge, BadgeCheck, Loader } from "lucide-react";
import React, { createElement } from "react";

export type StepState = "idle" | "active" | "completed" | "error";

export type DialogStep = {
  id: string;
  description: string;
  state: StepState;
  errorMessage?: string;
};

const stepStateIcons: Record<StepState, React.ElementType> = {
  idle: Badge,
  active: Loader,
  completed: BadgeCheck,
  error: AlertCircle,
};

const stateSpecificIconClasses: Record<StepState, string> = {
  idle: "text-slate-600",
  active: "text-slate-700 animate-spin bg-white rounded-full",
  completed: "text-slate-400",
  error: "text-red-500",
};

const stateSpecificTextClasses: Record<StepState, string> = {
  idle: "text-slate-600 font-medium",
  active: "text-slate-700 animate-pulse font-semibold",
  completed: "text-slate-400 font-medium",
  error: "text-red-500 font-medium",
};

interface TransactionDialogProps {
  steps: DialogStep[];
  title: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDialog: React.FC<TransactionDialogProps> = ({
  steps,
  title,
  open,
  onOpenChange,
}) => {
  const lastStep = steps[steps.length - 1];
  const isLastStepCompleted = lastStep?.state === "completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-normal">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 pt-3">
          {steps.map((step) => (
            <div
              key={step.description}
              className="flex items-center relative border-l-2 border-slate-300 pl-2 pb-6 last-of-type:pb-0"
            >
              <div
                className={cn(
                  "p-1 absolute -left-[14px] top-[2px] bg-slate-100 rounded-full",
                  stateSpecificIconClasses[step.state],
                  step === lastStep &&
                    isLastStepCompleted &&
                    "text-green-600 bg-green-100",
                )}
              >
                {createElement(stepStateIcons[step.state], { size: 18 })}
              </div>
              <div className="flex flex-col pl-4 justify-center">
                <p
                  className={cn(
                    "text-lg",
                    stateSpecificTextClasses[step.state],
                    step === lastStep &&
                      isLastStepCompleted &&
                      "text-green-600",
                  )}
                >
                  {step.description}
                </p>
                {step.state === "error" && step.errorMessage && (
                  <ScrollArea className="w-96 h-16 rounded p-2 bg-red-50">
                    <p className="text-red-500 text-xs font-mono">
                      ({step.errorMessage})
                    </p>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                )}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
