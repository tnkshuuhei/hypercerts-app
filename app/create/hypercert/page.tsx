"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSteps, { hypercertFormSteps } from "./form-steps";
import { Button } from "@/components/ui/button";

const MAX_FILE_SIZE = 3000000; // 3MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const formSchema = z.object({
  title: z.string().min(1, "We need a title for your hypercert"),
  logo: z.string().url("Logo URL is not valid"),
  banner: z
    .any()
    .refine((fileList) => fileList?.length === 1, {
      message: "Please upload an image",
    })
    .refine(
      (fileList) => ACCEPTED_IMAGE_TYPES.includes(fileList[0]?.type),
      "Must be a valid image type."
    )
    .refine(
      (fileList) => fileList[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 3MB.`
    ),
  description: z
    .string()
    .min(10, { message: "We need a longer description for your hypercert" }),
  link: z.string().url("Link URL is not valid"),
  tags: z.array(z.string()),
  dateWorkStart: z.string(),
  dateWorkEnd: z.string(),
  contributors: z.array(z.string()),
  allowListURL: z.string().nullable(),
  percentDistribution: z.number().nullable(),
  mergeDistribution: z.boolean().nullable(),
  contributorConfirmation: z.boolean().nullable(),
  termsConfirmation: z.boolean(),
});

export type HypercertFormValues = z.infer<typeof formSchema>;

const formDefaultValues: HypercertFormValues = {
  title: "",
  logo: "",
  banner: undefined,
  description: "",
  link: "",
  tags: [],
  dateWorkStart: "",
  dateWorkEnd: "",
  contributors: [],
  allowListURL: null,
  percentDistribution: null,
  mergeDistribution: null,
  contributorConfirmation: null,
  termsConfirmation: false,
};

export default function NewHypercertForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<HypercertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  function onSubmit(values: HypercertFormValues) {
    console.log(values);
  }

  return (
    <main className="flex min-h-screen flex-col justify-betweeen p-8 pb-20">
      <h1 className="font-serif text-5xl lg:text-8xl tracking-tight w-full">
        New hypercert
      </h1>
      <div className="p-6"></div>
      <section className="flex flex-col space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormSteps
              form={form}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              bannerRef={form.register("banner", { required: true })}
              logoRef={form.register("logo", { required: true })}
            />
            {currentStep === hypercertFormSteps.size && (
              <Button type="submit">Create Hypercert</Button>
            )}
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
