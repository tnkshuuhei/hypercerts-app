import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { HypercertFormValues } from "@/app/create/hypercert/page";

interface FormStepsProps {
  form: UseFormReturn<HypercertFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const GeneralInformation = ({ form }: FormStepsProps) => {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input {...field} />
          </FormControl>
          <FormDescription>Make it short and descriptive</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const ReviewAndSubmit = ({ form }: FormStepsProps) => {
  return (
    <section>
      <h3 className="text-xl font-semibold">Review and Submit</h3>
      <p className="text-slate-500">
        Please review the information you&apos;ve provided and submit your
        hypercert for approval.
      </p>
      <Button type="submit">Create Hypercert</Button>
    </section>
  );
};

const hypercertFormSteps = new Map([
  [
    1,
    {
      component: GeneralInformation,
      title: "General Information",
      fields: ["title"],
    },
  ],
  [2, { component: ReviewAndSubmit, title: "Review and Submit" }],
]);

const FormSteps = ({ form, currentStep, setCurrentStep }: FormStepsProps) => {
  const isLastStep = currentStep === hypercertFormSteps.size;
  const isCurrentStepValid = () => {
    const currentStepFields = hypercertFormSteps.get(currentStep)?.fields ?? [];
    const fieldsTouched = currentStepFields.every(
      (field) =>
        form.formState.touchedFields[field as keyof HypercertFormValues]
    );

    const currentStepErrors = currentStepFields.some(
      (field) => form.formState.errors[field as keyof HypercertFormValues]
    );
    console.log({
      fieldsTouched,
      currentStepErrors,
      touched: form.formState.touchedFields,
    });
    return fieldsTouched && !currentStepErrors;
  };

  return (
    <section>
      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Step {currentStep} of {hypercertFormSteps.size} &mdash;{" "}
        {hypercertFormSteps.get(currentStep)?.title}
      </h5>
      {(hypercertFormSteps.get(currentStep)?.component ?? (() => null))({
        form,
        currentStep,
        setCurrentStep,
      })}
      <div className="flex justify-between items-center py-3">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className={currentStep === 1 ? "hidden" : ""}
          variant={"outline"}
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setCurrentStep(currentStep + 1)}
          className={isLastStep || !isCurrentStepValid() ? "hidden" : ""}
        >
          Next
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default FormSteps;
