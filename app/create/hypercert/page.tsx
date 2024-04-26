"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  name: z.string().min(1),
  logo: z.string().url(),
  banner: z.string().url(),
  description: z.string().min(1),
  link: z.string().url(),
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

const formDefaultValues: z.infer<typeof formSchema> = {
  name: "",
  logo: "",
  banner: "",
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: formDefaultValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }
  return (
    <main className="flex min-h-screen flex-col justify-betweeen p-8">
      <h1 className="font-serif text-5xl lg:text-8xl tracking-tight text-center">
        New hypercert
      </h1>

      {/* TODO: Add form here */}
    </main>
  );
}
