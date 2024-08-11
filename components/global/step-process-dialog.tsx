import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertCircle, Badge, BadgeCheck, Loader } from "lucide-react";
import React, {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export type StepState = "idle" | "active" | "completed" | "error";

export type DialogStep = {
  id: string;
  description: string;
  state: StepState;
  errorMessage?: string;
};

export type StepData = Pick<DialogStep, "id" | "description">;

export const StepProcessDialogContext = createContext<{
  setDialogStep: (step: DialogStep["id"], errorMessage?: string) => void;
  setDialogSteps: React.Dispatch<React.SetStateAction<DialogStep[]>>;
  setSteps: React.Dispatch<React.SetStateAction<StepData[]>>;
  setOpen: (open: boolean) => void;
  setTitle: (title: string) => void;
  dialogSteps: DialogStep[];
}>({
  setDialogStep: () => {},
  setDialogSteps: () => {},
  setSteps: () => {},
  setOpen: () => {},
  setTitle: () => {},
  dialogSteps: [],
});

export const StepProcessDialogProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [steps, setSteps] = useState<StepData[]>([]);
  const [dialogSteps, setDialogSteps] = useState<DialogStep[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("Transaction in progress...");

  useEffect(() => {
    setDialogSteps(
      steps.map((step) => ({
        ...step,
        state: "idle" as StepState,
        errorMessage: "",
      })),
    );
  }, [steps]);
  const setDialogStep = useCallback(
    (stepId: DialogStep["id"], errorMessage?: string) => {
      setDialogSteps((prevSteps) => {
        const stepIndex = prevSteps.findIndex((step) => step.id === stepId);
        if (stepIndex === -1) return prevSteps;

        return prevSteps.map((step, index) => {
          if (index !== stepIndex) {
            return {
              ...step,
              state: index < stepIndex ? "completed" : "idle",
            };
          }

          const newState: StepState = errorMessage ? "error" : "active";
          return {
            ...step,
            state: newState,
            errorMessage: errorMessage || "",
          };
        });
      });
    },
    [],
  );

  return (
    <StepProcessDialogContext.Provider
      value={{
        setDialogStep: (step: string, errorMessage?: string) =>
          setDialogStep(step, errorMessage || ""),
        setDialogSteps,
        setSteps,
        setOpen,
        setTitle,
        dialogSteps,
      }}
    >
      {children}
      <StepProcessModal
        open={open}
        onOpenChange={setOpen}
        steps={dialogSteps}
        title={title}
      />
    </StepProcessDialogContext.Provider>
  );
};

export const useStepProcessDialogContext = () =>
  useContext(StepProcessDialogContext);

interface DialogProps {
  steps: DialogStep[];
  title: string;
  triggerLabel?: string;
  extraContent?: React.ReactNode;
  open: boolean;
}

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

const StepProcessModal = ({
  steps,
  title,
  triggerLabel,
  extraContent,
  open,
  onOpenChange,
}: DialogProps & { onOpenChange: (open: boolean) => void }) => {
  const lastStep = steps[steps.length - 1];
  const isLastStepCompleted = lastStep?.state === "completed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      {triggerLabel && (
        <DialogTrigger
          asChild
          className={buttonVariants({ variant: "secondary" })}
        >
          {triggerLabel}
        </DialogTrigger>
      )}
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
                {createElement(stepStateIcons[step.state], {
                  size: 18,
                })}
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
                  {step.state === "error" && step.errorMessage && (
                    <span className="text-red-500 text-sm ml-2">
                      ({step.errorMessage})
                    </span>
                  )}
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
        <div className="flex flex-col px-2 pt-3">{extraContent}</div>
      </DialogContent>
    </Dialog>
  );
};

export { StepProcessModal as default };
