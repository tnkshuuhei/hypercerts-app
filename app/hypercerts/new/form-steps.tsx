import { HypercertFormValues } from "@/app/hypercerts/new/page";
import ConnectDialog from "@/components/connect-dialog";
import HypercertCard from "@/components/hypercert/hypercert-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toPng } from "html-to-image";
import { ArrowLeftIcon, ArrowRightIcon, CalendarIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useAccount } from "wagmi";

interface FormStepsProps {
  form: UseFormReturn<HypercertFormValues>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const GeneralInformation = ({ form }: FormStepsProps) => {
  return (
    <section className="space-y-8">
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
              <Textarea {...field} className="resize-none h-32" />
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
      <FormField
        control={form.control}
        name="tags"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Tags</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none h-4"
                placeholder="Separate tags with commas"
                onChange={(e) => {
                  const tags = e.target.value
                    .split(",")
                    .map((tag) => tag.trim().toLowerCase());
                  field.onChange(tags.length > 0 ? tags : []);
                }}
              />
            </FormControl>
            <FormDescription>
              Tags are used to categorize your project.
            </FormDescription>
            <FormMessage />
            {field.value &&
              field.value.filter((tag: string) => tag !== "").length > 0 && (
                <div className="flex flex-wrap gap-0.5">
                  {field?.value?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
          </FormItem>
        )}
      />
    </section>
  );
};

const DatesAndPeople = ({ form }: FormStepsProps) => {
  return (
    <section className="space-y-8">
      <FormField
        control={form.control}
        name="projectDates"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Project start and end date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full max-w-[280px] pl-3 text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value.from ? (
                      field.value.to ? (
                        <>
                          {format(field.value.from, "LLL dd, y")} &mdash;{" "}
                          {format(field.value.to, "LLL dd, y")}
                        </>
                      ) : (
                        format(field.value.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: field.value.from!,
                    to: field.value.to,
                  }}
                  defaultMonth={field.value.from}
                  onSelect={(selectedDates) => {
                    field.onChange(selectedDates);
                    field.onBlur();
                  }}
                  disabled={(date) => date < new Date("1900-01-01")}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <FormDescription>
              The start and end date of the work considered in the hypercert
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contributors"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contributors</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                className="resize-none h-8"
                placeholder="Separate contributors with commas"
                onChange={(e) => {
                  const contributors = e.target.value
                    .split(",")
                    .map((contributor) => contributor.trim().toLowerCase());
                  field.onChange(contributors.length > 0 ? contributors : []);
                }}
              />
            </FormControl>
            <FormDescription>
              Add contributors&apos; addresses, names or pseudonyms.
            </FormDescription>
            <FormMessage />
            {field.value &&
              field.value.filter((contributor) => contributor !== "").length >
                0 && (
                <div className="flex flex-wrap gap-0.5">
                  <Badge variant="secondary">
                    {
                      field.value.filter((contributor) => contributor !== "")
                        .length
                    }{" "}
                    {field.value.length > 1 ? "contributors" : "contributor"}{" "}
                    added
                  </Badge>
                </div>
              )}
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmContributorsPermission"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked === true) {
                    field.onBlur();
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I confirm that all listed contributors have permitted their
                works&apos; inclusion in this hypercert.
              </FormLabel>
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="allowlistURL"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Allowlist URL (optional)</FormLabel>
            <FormControl>
              <Input
                {...field}
                value={field.value || ""}
                placeholder="https://"
              />
            </FormControl>
            <div className="inline-flex text-xs space-x-1">
              <span>Create an allowlist at</span>
              <Link
                href="https://allowlist-creator.vercel.app/"
                target="_blank"
                rel="noreferrer"
                className="underline text-slate-500 text-wrap hover:text-slate-700 transition-colors"
              >
                allowlist-creator.vercel.app
              </Link>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );
};

const ReviewAndSubmit = ({ form }: FormStepsProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const takeCardSnapshot = useCallback(() => {
    if (cardRef.current === null) {
      return;
    }

    toPng(cardRef.current, {
      cacheBust: true,
      fetchRequestInit: { mode: "cors" },
    })
      .then((dataUrl) => {
        form.setValue("cardImage", dataUrl);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [cardRef, form]);

  useEffect(() => {
    takeCardSnapshot();
  }, [takeCardSnapshot]);

  return (
    <section className="space-y-8">
      <div className="flex flex-col space-y-4 items-center md:hidden">
        <HypercertCard
          name={form.getValues().title || undefined}
          description={form.getValues().description || undefined}
          banner={
            `https://cors-proxy.hypercerts.workers.dev/?url=${
              form.getValues().banner
            }` || undefined
          }
          logo={
            `https://cors-proxy.hypercerts.workers.dev/?url=${
              form.getValues().logo
            }` || undefined
          }
          ref={cardRef}
        />
      </div>

      <FormField
        control={form.control}
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => {
                  field.onChange(checked);
                  if (checked === true) {
                    field.onBlur();
                  }
                }}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                I have read and agree to the{" "}
                <Link
                  href="https://hypercerts.org/terms/"
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-slate-500"
                >
                  terms and conditions
                </Link>
              </FormLabel>
            </div>
          </FormItem>
        )}
      />
    </section>
  );
};

export const hypercertFormSteps = new Map([
  [
    1,
    {
      title: "General Details",
      fields: ["title", "banner", "description", "logo", "link", "tags"],
    },
  ],
  [
    2,
    {
      title: "Dates & People",
      fields: ["projectDates", "contributors", "confirmContributorsPermission"],
    },
  ],
  [3, { title: "Review & Mint", fields: ["acceptTerms"] }],
]);

const FormSteps = ({ form, currentStep, setCurrentStep }: FormStepsProps) => {
  const isLastStep = currentStep === hypercertFormSteps.size;
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

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
      <div className="space-y-3">
        <Progress value={(currentStep / 3) * 100} className="h-[6px]" />

        <div className="flex justify-between gap-2">
          {Array.from(hypercertFormSteps.entries()).map(([step, { title }]) => (
            <div
              className={`text-sm md:text-base text-center md:text-left px-3 py-2 rounded-md space-y-1 md:space-y-0 md:space-x-2 flex flex-col md:flex-row items-center ${
                step === currentStep
                  ? "text-slate-700 font-semibold bg-slate-100"
                  : "text-slate-700/60"
              }`}
              key={step}
            >
              <Badge
                variant={step === currentStep ? "default" : "outline"}
                className={
                  step === currentStep ? "text-slate-50" : "text-slate-700/60"
                }
              >
                {step}
              </Badge>
              <p className="md:ml-2">{title}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="p-1" />
      {currentStep === 1 && (
        <GeneralInformation
          form={form}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
        />
      )}
      {currentStep === 2 && (
        <DatesAndPeople
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
        {isLastStep && address && isCurrentStepValid() && (
          <Button type="submit">
            Mint hypercert
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </Button>
        )}
        {isLastStep && !address && isCurrentStepValid() && (
          <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
        )}
      </div>
    </section>
  );
};

export default FormSteps;