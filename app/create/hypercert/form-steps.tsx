import { HypercertFormValues } from "@/app/create/hypercert/page";
import { Badge } from "@/components/ui/badge";
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
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

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
              <Input {...field} />
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
              Describe your project: why it was created, and how it works
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="link"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Link</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://" />
            </FormControl>
            <FormDescription>Paste a link to the project</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="logo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Logo</FormLabel>
            <FormControl>
              <Input {...field} placeholder="https://" />
            </FormControl>
            <FormDescription>The URL to your project logo</FormDescription>
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
              <Input {...field} placeholder="https://" />
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

const WorkScope = ({ form }: FormStepsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none h-8"
                placeholder="Tags are used to categorize your project."
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim().toLowerCase());
                  field.onChange(tags.length > 0 ? tags : []);
                }}
              />
            </FormControl>
            <FormDescription>Separate tags with commas.</FormDescription>
            <FormMessage />
            {field.value && field.value.length > 0 && (
              <div className="flex flex-wrap gap-0.5">
                {field?.value?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
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
      title: "General Information",
      fields: ["title", "banner", "description", "logo", "link"],
    },
  ],
  [2, { title: "Work Scope", fields: ["tags"] }],
  [3, { title: "Review and Submit" }],
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

    return fieldsTouched && !currentStepErrors;
  };

  return (
    <section className="space-y-5">
      <h5 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Step {currentStep} of {hypercertFormSteps.size} &mdash;{" "}
        {hypercertFormSteps.get(currentStep)?.title}
      </h5>
      {currentStep === 1 && (
        <GeneralInformation
          form={form}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <WorkScope
          form={form}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 3 && (
        <ReviewAndSubmit
          form={form}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}

      <div className="flex justify-between items-center py-3">
        <Button
          onClick={() => setCurrentStep(currentStep - 1)}
          className={currentStep === 1 ? "hidden" : ""}
          variant={"outline"}
          type="button"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {!isLastStep && (
          <Button
            onClick={() => setCurrentStep(currentStep + 1)}
            className={!isCurrentStepValid() ? "hidden" : ""}
            type="button"
          >
            Next
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
        {isLastStep && (
          <Button type="submit">
            Mint hypercert
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </section>
  );
};

export default FormSteps;
