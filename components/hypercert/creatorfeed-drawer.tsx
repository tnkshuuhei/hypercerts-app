"use client";

import "@yaireo/tagify/dist/tagify.css"; // Tagify CSS

import { useState } from "react";
import { ArrowUpRight, LoaderCircle, Plus, X } from "lucide-react";
import { Button } from "../ui/button";
import { Drawer } from "vaul";
import { clearCacheAfterEvaluation } from "@/app/actions/clearCacheAfterEvaluation";
import { cn } from "@/lib/utils";
import { errorHasMessage } from "@/lib/errorHasMessage";
import { errorHasReason } from "@/lib/errorHasReason";
import { getEasConfig } from "@/eas/getEasConfig";
import { isChainIdSupported } from "@/lib/isChainIdSupported";
import { useEthersSigner } from "@/ethers/hooks/useEthersSigner";
import { useToast } from "../ui/use-toast";
import { Checkbox } from "../ui/checkbox";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { isAddress } from "ethers";
import { createCreatorFeedAttestation } from "@/eas/createCreatorFeedAttestation";
import { TooltipInfo } from "../tooltip-info";

const creatorFeedSchema = z.object({
  chainId: z.string(),
  contractAddress: z.string().refine((val) => isAddress(val), {
    message: "Contract address is not a valid Ethereum address",
  }),
  tokenId: z.string(),
  title: z.string().max(50, {
    message: "Title should be less than 50 characters",
  }),
  description: z.string().max(500, {
    message: "Description should be less than 500 characters",
  }),
  links: z.array(
    z.object({
      type: z.string(),
      src: z.string().url({ message: "Please enter a valid URL" }),
    }),
  ),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
  // ref: z.string(),
});

export type CreatorFeedFormValues = z.infer<typeof creatorFeedSchema>;

export function CreatorFeedDrawer({ hypercertId }: { hypercertId: string }) {
  const { toast } = useToast();
  const [chainId, contractAddress, tokenId] = hypercertId.split("-");
  const rpcSigner = useEthersSigner({ chainId: +chainId });
  const [isAttesting, setIsAttesting] = useState(false);
  const [uid, setUid] = useState<string>();

  const form = useForm<z.infer<typeof creatorFeedSchema>>({
    resolver: zodResolver(creatorFeedSchema),
    defaultValues: {
      chainId: chainId,
      contractAddress: contractAddress,
      tokenId: tokenId,
      links: [],
      termsAccepted: false,
    },
  });
  const {
    fields: linkFields,
    append: appendLink,
    remove: removeLink,
  } = useFieldArray({
    control: form.control,
    name: "links",
  });
  const addNewLink = () => {
    appendLink({ type: "url", src: "" });
  };

  async function onSubmit(values: CreatorFeedFormValues) {
    console.log("values", values);
    if (!rpcSigner) {
      console.error("rpcSigner not found");
      return errorToast("Please connect your wallet to attest.");
    }

    setIsAttesting(true);
    try {
      const { uid } = await createCreatorFeedAttestation(values, rpcSigner);
      setUid(uid);
    } catch (e) {
      if (errorHasReason(e)) {
        errorToast(e.reason);
      } else if (errorHasMessage(e)) {
        errorToast(e.message);
      } else {
        errorToast("An error occurred while creating the attestation.");
      }
      console.error(e);
    } finally {
      setIsAttesting(false);
    }
  }

  const errorToast = (message: string | undefined) => {
    toast({
      title: message,
      variant: "destructive",
      duration: 2000,
    });
  };

  if (!isChainIdSupported(chainId)) {
    return (
      <div>
        Please connect to a supported chain to attest. Attestation is open to
        listed trusted evaluators, see{" "}
        <a
          href="https://github.com/hypercerts-org/hypercerts-attestor-registry"
          target="_blank"
        >
          {" "}
          Hypercerts Attestor Registry
        </a>{" "}
        for more information.
      </div>
    );
  }

  if (uid) {
    clearCacheAfterEvaluation(hypercertId);

    const easConfig = getEasConfig(+chainId);
    const url = `${easConfig?.explorerUrl}/attestation/view/${uid}`;
    return (
      <>
        <Drawer.Title className="uppercase font-serif text-3xl font-medium tracking-tight">
          Submit additional information
        </Drawer.Title>
        <p>
          Your information has been submitted successfully as an attestation!
        </p>
        <a
          href={url}
          title={url}
          target="_blank"
          rel="norefferer"
          className="flex items-center group text-blue-600 px-2 py-1 bg-blue-50 hover:bg-blue-100 w-max rounded-lg text-sm font-medium"
        >
          <span>
            {uid.slice(0, 6)}...{uid.slice(-4)}
          </span>
          <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
        </a>
        <p>
          Information will not be immediately visible on the Hypercerts page,
          but will be visible in ~2 minutes.
        </p>
      </>
    );
  }

  return (
    <>
      <Drawer.Title className="font-serif text-3xl font-medium tracking-tight">
        SUBMIT ADDITIONAL INFORMATION
      </Drawer.Title>

      <p>
        You can share comments or documents to share insights on the outputs,
        outcomes, and impact of your work. This information will be saved as an
        on-chain attestation and cannot be changed or deleted afterward.
      </p>

      {/* Forms */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="uppercase">Title</FormLabel>
                  <TooltipInfo
                    tooltipText="Enter a brief title, such as 'Impact Report' or 'Progress Update' (max. 50 characters)."
                    className="w-4 h-4"
                  />
                </div>
                <FormControl>
                  <Input {...field} placeholder="Impact Report" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel className="uppercase">Description</FormLabel>
                  <TooltipInfo
                    tooltipText="Add new information here, or provide a brief description of the details available in the document you can link to below (max. 500 characters)."
                    className="w-4 h-4"
                  />
                </div>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="This report outlines the impact achieved, including a 10% increase in [impact metric]. For full details, see the linked PDF"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="termsAccepted"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    I confirm that the uploaded files conform to the terms and
                    conditions.
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          <div className="flex flex-col space-y-4">
            <div className="flex items-center gap-2">
              <FormLabel className="uppercase">Links</FormLabel>
              <TooltipInfo
                tooltipText="Add a publicly accessible HTTPS or IPFS link to your document or content. Ensure the content is public and remains accessible."
                className="w-4 h-4"
              />
            </div>
            {linkFields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name={`links.${index}.type`}
                  render={({ field }) => (
                    <Input type="hidden" {...field} value="url" />
                  )}
                />
                <FormField
                  control={form.control}
                  name={`links.${index}.src`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://example.com/impact-report.pdf"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10"
                  onClick={() => removeLink(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={addNewLink}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>

          <div className="flex gap-5 justify-center w-full">
            <Drawer.Close asChild>
              <Button variant="outline" className="w-1/2">
                Cancel
              </Button>
            </Drawer.Close>
            <Button
              disabled={!form.formState.isValid || isAttesting}
              type="submit"
              className={cn("w-1/2", {
                "opacity-50 cursor-not-allowed":
                  !form.formState.isValid || isAttesting,
              })}
            >
              {isAttesting && (
                <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
              )}
              {isAttesting ? "Submitting information" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
