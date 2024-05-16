"use client";

import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import FormSteps from "./form-steps";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import {
  HypercertMetadata,
  TransferRestrictions,
  formatHypercertData,
} from "@hypercerts-org/sdk";
import { useMintClaim } from "@/hooks/use-mint-claim";

const DEFAULT_NUM_FRACTIONS: number = 10000;
const DEFAULT_HYPERCERT_VERSION: string = "0.0.1";

const formSchema = z.object({
  title: z.string().min(1, "We need a title for your hypercert"),
  logo: z.string().url("Logo URL is not valid"),
  banner: z.string().url("Banner URL is not valid"),
  description: z
    .string()
    .min(10, { message: "We need a longer description for your hypercert" }),
  link: z.string().url("Link URL is not valid"),
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
    .refine((data) => data.from < data.to, {
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
  //   allowListURL: z.string().nullable(),
  //   percentDistribution: z.number().nullable(),
  //   mergeDistribution: z.boolean().nullable(),
  //   contributorConfirmation: z.boolean().nullable(),
});

export type HypercertFormValues = z.infer<typeof formSchema>;

const formDefaultValues: HypercertFormValues = {
  title: "",
  banner: "",
  description: "",
  logo: "",
  link: "",
  tags: [""],
  projectDates: {
    from: new Date(),
    to: new Date(),
  },
  contributors: [""],
  acceptTerms: false,
  confirmContributorsPermission: false,
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

  const onMintComplete = () => {
    console.log("Minting complete");
  };

  const { write: mintClaim, txPending: mintClaimPending } = useMintClaim({
    onComplete: onMintComplete,
  });

  function onSubmit(values: HypercertFormValues) {
    // TODO: remove empty tags
    console.log(values);

    const metadata: HypercertMetadata = {
      name: values.title,
      description: values.description,
      image: values.banner, // TODO: Change to canvas snapshot
      external_url: values.link,
    };

    const formattedMetadata = formatHypercertData({
      ...metadata,
      version: "0.0.1",
      properties: [
        {
          trait_type: "Minted by",
          value: "true",
        },
      ],
      impactScope: [],
      excludedImpactScope: [],
      workScope: [],
      excludedWorkScope: [],
      rights: [],
      excludedRights: [],
      workTimeframeStart: values.projectDates.from.getTime() * 1000,
      workTimeframeEnd: values.projectDates.to.getTime() * 1000,
      impactTimeframeStart: values.projectDates.from.getTime() * 1000,
      impactTimeframeEnd: values.projectDates.to.getTime() * 1000,
      contributors: values.contributors,
    });

    mintClaim(
      formattedMetadata.data!,
      DEFAULT_NUM_FRACTIONS,
      TransferRestrictions.FromCreatorOnly
    );
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
