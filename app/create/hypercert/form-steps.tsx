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
import { UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { HypercertFormValues } from "@/app/create/hypercert/page";
import { Textarea } from "@/components/ui/textarea";

interface FormStepsProps {
  form: UseFormReturn<HypercertFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const GeneralInformation = ({ form }: FormStepsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus={true} autoCapitalize="words" />
            </FormControl>
            <FormDescription>Keep it short but descriptive!</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea {...field} />
            </FormControl>
            <FormDescription>
              Describe your project, why it was created, and how it works
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="banner"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Banner image</FormLabel>
            <FormControl>
              <Input {...field} placeholder="ipfs://" />
            </FormControl>
            <FormDescription>
              The URL to an image to be displayed as the banner
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
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
    </section>
  );
};

export const hypercertFormSteps = new Map([
  [
    1,
    {
      component: GeneralInformation,
      title: "General Information",
      fields: ["title", "banner", "description"],
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

    const isBannerUploaded = form.getValues("banner")?.length > 0;

    return fieldsTouched && !currentStepErrors && isBannerUploaded;
  };

  return (
    <section className="space-y-5">
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
          onClick={() => (isLastStep ? null : setCurrentStep(currentStep + 1))}
          className={!isCurrentStepValid() ? "hidden" : ""}
          type={isLastStep ? "submit" : "button"}
        >
          {isLastStep ? "Submit" : "Next"}
          <ArrowRightIcon className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </section>
  );
};

export default FormSteps;
