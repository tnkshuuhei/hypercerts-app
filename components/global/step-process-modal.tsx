import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Badge, BadgeCheck, Loader } from "lucide-react";
import { createElement, useState } from "react";

interface StepState {
  idle: string;
  active: string;
  completed: string;
}

interface Step {
  label: string;
  description?: string;
  state: keyof StepState;
}

const steps: Step[] = [
  {
    label: "Preparing to mint hypercert",
    state: "completed",
  },
  {
    label: "Minting hypercert on-chain",
    state: "active",
  },
  {
    label: "Awaiting confirmation",
    state: "idle",
  },
  {
    label: "Done minting",
    state: "idle",
  },
];

const stepStateIcons: Record<keyof StepState, React.ElementType> = {
  idle: Badge,
  active: Loader,
  completed: BadgeCheck,
};

const stateSpecificIconClasses: Record<keyof StepState, string> = {
  idle: "text-slate-600",
  active: "text-slate-700 animate-spin bg-white rounded-full",
  completed: "text-slate-400",
};

const stateSpecificTextClasses: Record<keyof StepState, string> = {
  idle: "text-slate-600 font-medium",
  active: "text-slate-700 animate-pulse font-semibold",
  completed: "text-slate-400 font-medium",
};

const StepProcessModal = () => {
  const [activeStep, setActiveStep] = useState<Step>(steps[3]);
  const lastStep = steps[steps.length - 1];
  const isLastStepActive = activeStep === lastStep;
  const isLastStepCompleted = lastStep.state === "completed";

  const setNextStep = () => {
    if (isLastStepActive || isLastStepCompleted) return;
    steps[steps.indexOf(activeStep!)].state = "completed";
    steps[steps.indexOf(activeStep!) + 1].state = "active";
    setActiveStep(steps[steps.indexOf(activeStep!) + 1]);
  };

  return (
    <Dialog>
      <DialogTrigger>Mint Hypercert</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-normal">
            Mint hypercert
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 pt-3">
          {steps.map((step) => (
            <div
              key={step.label}
              className="flex items-center relative border-l-2 border-slate-300 pl-2 pb-6 last-of-type:pb-0"
            >
              <div
                className={cn(
                  "p-1 absolute -left-[14px] top-[2px] bg-slate-100 rounded-full",
                  stateSpecificIconClasses[step.state],
                  step === lastStep &&
                    isLastStepCompleted &&
                    "text-green-600 bg-green-100"
                )}
              >
                {createElement(stepStateIcons[step.state], {
                  size: 18,
                })}
              </div>
              <div className="flex flex-col pl-4 justify-center">
                <p
                  className={cn(
                    "text-lg",
                    stateSpecificTextClasses[step.state],
                    step === lastStep && isLastStepCompleted && "text-green-600"
                  )}
                >
                  {step.label}
                </p>
                <p className="text-base font-normal">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { StepProcessModal as default };
