"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSteps from "./form-steps";

const formSchema = z.object({
  title: z.string().min(1, "We need a title for your hypercert"),
  logo: z.string().url("Logo URL is not valid"),
  banner: z.string().url("Banner URL is not valid"),
  description: z
    .string()
    .min(10, { message: "We need a longer description for your hypercert" }),
  link: z.string().url("Link URL is not valid"),
  tags: z.array(z.string()).nonempty("We need at least one tag"),
  //   dateWorkEnd: z.string(),
  //   contributors: z.array(z.string()),
  //   allowListURL: z.string().nullable(),
  //   percentDistribution: z.number().nullable(),
  //   mergeDistribution: z.boolean().nullable(),
  //   contributorConfirmation: z.boolean().nullable(),
  //   termsConfirmation: z.boolean(),
});

export type HypercertFormValues = z.infer<typeof formSchema>;

const formDefaultValues: HypercertFormValues = {
  title: "",
  banner: "",
  description: "",
  logo: "",
  link: "",
  tags: [""],
  // dateWorkStart: "",
  // dateWorkEnd: "",
  // contributors: [],
  // allowListURL: null,
  // percentDistribution: null,
  // mergeDistribution: null,
  // contributorConfirmation: null,
  // termsConfirmation: false,
};

export default function NewHypercertForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<HypercertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  function onSubmit(values: HypercertFormValues) {
    // TODO: remove empty tags
    console.log(values);
  }

  return (
    <main className="flex flex-col justify-betweeen px-8 pt-4 pb-20">
      <h1 className="font-serif text-4xl lg:text-8xl tracking-tight w-full">
        New hypercert
      </h1>
      <div className="p-3"></div>
      <section className="flex flex-col space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSteps
              form={form}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
            />
          </form>
        </Form>
      </section>
      {/* <div className="flex flex-col space-y-4 items-center">
        <HypercertCard
          title={form.getValues().title || undefined}
          description={form.getValues().description || undefined}
          banner={form.getValues().banner || undefined}
          logo={form.getValues().logo || undefined}
          displayOnly
        />
      </div> */}
    </main>
  );
}
