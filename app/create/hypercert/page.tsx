"use client";

import HypercertCard from "@/components/hypercert-card";
import { Form } from "@/components/ui/form";
import { useMintClaim } from "@/hooks/use-mint-claim";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  HypercertMetadata,
  TransferRestrictions,
  formatHypercertData,
} from "@hypercerts-org/sdk";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSteps from "./form-steps";

const DEFAULT_NUM_FRACTIONS: number = 10000;
const DEFAULT_HYPERCERT_VERSION: string = "0.0.1";

const formSchema = z.object({
  title: z.string().trim().min(1, "We need a title for your hypercert"),
  logo: z.string().url("Logo URL is not valid"),
  banner: z.string().url("Banner URL is not valid"),
  description: z
    .string()
    .trim()
    .min(10, { message: "We need a longer description for your hypercert" }),
  link: z.string().url("Link URL is not valid"),
  cardImage: z.string().url("Card image not generated"),
  tags: z
    .array(z.string())
    .refine((data) => data.filter((tag) => tag !== "").length > 0, {
      message: "We need at least one tag",
    }),
  projectDates: z
    .object(
      {
        from: z.date(),
        to: z.date(),
      },
      {
        required_error: "Please select a date range",
      }
    )
    .refine((data) => data.from <= data.to, {
      path: ["projectDates"],
      message: "From date must be before to date",
    }),
  contributors: z
    .array(z.string())
    .refine(
      (data) => data.filter((contributor) => contributor !== "").length > 0,
      {
        message: "We need at least one contributor",
      }
    ),
  acceptTerms: z.boolean().refine((data) => data === true, {
    message: "You must accept the terms and conditions",
  }),
  confirmContributorsPermission: z.boolean().refine((data) => data === true, {
    message: "You must confirm that all contributors gave their permission",
  }),
  allowlistURL: z.union([z.string().url(), z.literal(""), z.null().optional()]),
  //   percentDistribution: z.number().nullable(),
  //   mergeDistribution: z.boolean().nullable(),
});

export type HypercertFormValues = z.infer<typeof formSchema>;

const formDefaultValues: HypercertFormValues = {
  title: "",
  banner: "",
  description: "",
  logo: "",
  link: "",
  cardImage: "",
  tags: [""],
  projectDates: {
    from: new Date(),
    to: new Date(),
  },
  contributors: [""],
  acceptTerms: false,
  confirmContributorsPermission: false,
  allowlistURL: "",
  // percentDistribution: null,
  // mergeDistribution: null,
};

export default function NewHypercertForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const form = useForm<HypercertFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
    mode: "onChange",
  });

  const onMintComplete = () => {
    console.log("Minting complete");
  };

  const { write: mintClaim, txPending: mintClaimPending } = useMintClaim({
    onComplete: onMintComplete,
  });

  async function onSubmit(values: HypercertFormValues) {
    const metadata: HypercertMetadata = {
      name: values.title,
      description: values.description,
      image: values.cardImage,
      external_url: values.link,
      allowList: values.allowlistURL ?? undefined,
    };

    const formattedMetadata = formatHypercertData({
      ...metadata,
      version: "2.0",
      properties: [],
      impactScope: ["all"],
      excludedImpactScope: [],
      workScope: values.tags,
      excludedWorkScope: [],
      rights: ["Public Display"],
      excludedRights: [],
      workTimeframeStart: values.projectDates.from.getTime() / 1000,
      workTimeframeEnd: values.projectDates.to.getTime() / 1000,
      impactTimeframeStart: values.projectDates.from.getTime() / 1000,
      impactTimeframeEnd: values.projectDates.to.getTime() / 1000,
      contributors: values.contributors,
    });
    console.log({ formattedMetadata });

    await mintClaim(
      formattedMetadata.data!,
      DEFAULT_NUM_FRACTIONS,
      TransferRestrictions.FromCreatorOnly
    );
  }

  return (
    <main className="flex flex-col px-8 pt-4 pb-20 container max-w-screen-lg">
      <h1 className="font-serif text-3xl lg:text-5xl tracking-tight w-full">
        New hypercert
      </h1>
      <div className="p-3"></div>
      <section className="flex space-x-4 items-center">
        <section className="flex flex-col space-y-4 flex-1 md:pr-5 md:border-r-[1.5px] md:border-slate-200">
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
        <div className="hidden md:flex flex-col p-6 items-center">
          <HypercertCard
            title={form.getValues().title || undefined}
            description={form.getValues().description || undefined}
            banner={form.getValues().banner || undefined}
            logo={form.getValues().logo || undefined}
            displayOnly
          />
        </div>
      </section>
    </main>
  );
}
