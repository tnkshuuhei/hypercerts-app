"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAccount, useEnsAvatar, useEnsName } from "wagmi";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { normalize } from "viem/ens";
import { Button } from "@/components/ui/button";
import { mainnet } from "viem/chains";
import { useEffect } from "react";
import Image from "next/image";
import { useAddOrUpdateUser } from "@/users/hooks";

const formSchema = z.object({
  displayName: z.string().max(30, "Max. 30 characters").optional(),
  avatar: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
});

export type SettingsFormValues = z.infer<typeof formSchema>;

const defaultValues = {
  displayName: "",
  avatar: "",
};

export const SettingsForm = () => {
  const { address } = useAccount();
  const { data: ensName } = useEnsName({
    address: normalize(address || "") as `0x${string}`,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName || undefined,
    chainId: mainnet.id,
  });

  const { mutateAsync: addOrUpdateUser, isPending } = useAddOrUpdateUser();
  const onSubmit = async (data: SettingsFormValues) => {
    await addOrUpdateUser(data);
  };

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    disabled: isPending,
  });

  const { displayName, avatar } = form.watch();

  useEffect(() => {
    if (!displayName && ensName) {
      form.setValue("displayName", ensName);
    }
  }, [displayName, ensName, form]);

  useEffect(() => {
    if (!avatar && ensAvatar) {
      form.setValue("avatar", ensAvatar);
    }
  }, [ensAvatar, avatar, form]);

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-y-4"
        >
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Max. 30 characters</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Image</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {avatar && (
            <>
              <FormLabel>Preview</FormLabel>
              <Image
                src={avatar}
                alt=""
                width={100}
                height={100}
                className="rounded-full"
              />
            </>
          )}

          <Button>Save changes</Button>
        </form>
      </Form>
    </div>
  );
};
