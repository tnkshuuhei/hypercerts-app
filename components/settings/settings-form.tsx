"use client";

import z from "zod";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import isURL from "validator/lib/isURL";
import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
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
import { Button } from "@/components/ui/button";
import { useAddOrUpdateUser, useGetUser } from "@/users/hooks";
import { useAccountDetails } from "@/hooks/useAccountDetails";
import { useAccountStore } from "@/lib/account-store";
import { errorHasMessage } from "@/lib/errorHasMessage";
import { errorHasReason } from "@/lib/errorHasReason";

import {
  parsePendingUserUpdate,
  type PendingUserUpdate,
} from "@/settings/pending-user-update-parser";
import { PendingUpdateCard } from "@/components/settings/pending-update-card";

const formSchema = z.object({
  displayName: z.string().max(30, "Max. 30 characters").optional(),
  avatar: z.union([z.string().url("Invalid URL"), z.literal("")]).optional(),
});

export type SettingsFormValues = z.infer<typeof formSchema>;

const defaultValues = {
  displayName: "",
  avatar: "",
};

const ERROR_TOAST_DURATION = 5000;

type LoadingStates = {
  isLoadingDetails: boolean;
  isPendingGetUser: boolean;
  isPendingUpdateUser: boolean;
};

export const SettingsForm = () => {
  const { selectedAccount } = useAccountStore();
  const {
    address,
    ensName,
    ensAvatar,
    isLoading: isLoadingDetails,
  } = useAccountDetails();
  const {
    data: userData,
    isFetching: isPendingGetUser,
    refetch: refetchUser,
  } = useGetUser({
    address,
  });
  const [pendingUpdate, setPendingUpdate] = useState<PendingUserUpdate>();

  const { mutateAsync: addOrUpdateUser, isPending: isPendingUpdateUser } =
    useAddOrUpdateUser();

  const { toast } = useToast();

  const onSubmit = async (data: SettingsFormValues) => {
    try {
      await addOrUpdateUser(data);

      if (selectedAccount?.type !== "safe") {
        return;
      }

      setPendingUpdate({
        user: {
          displayName: data.displayName || "",
          avatar: data.avatar || "",
        },
        metadata: {
          timestamp: new Date().getTime() / 1000,
        },
      });

      // Show original values
      form.setValue(
        "displayName",
        userData?.user?.display_name || ensName || "",
      );
      form.setValue("avatar", userData?.user?.avatar || ensAvatar || "");
      await refetchUser();
    } catch (error) {
      if (errorHasReason(error)) {
        toast({
          title: "Error",
          description: error.reason,
          variant: "destructive",
          duration: ERROR_TOAST_DURATION,
        });
      } else if (errorHasMessage(error)) {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
          duration: ERROR_TOAST_DURATION,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update user settings",
          variant: "destructive",
          duration: ERROR_TOAST_DURATION,
        });
      }
    }
  };

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
    mode: "all",
    reValidateMode: "onChange",
  });

  const [displayName, avatar] = useWatch({
    control: form.control,
    name: ["displayName", "avatar"],
  });

  const loadingStates: LoadingStates = {
    isLoadingDetails,
    isPendingGetUser,
    isPendingUpdateUser,
  };

  const isLoading = Object.values(loadingStates).some(Boolean);

  const isFormDisabled = isLoading || !!pendingUpdate;

  const isSubmitDisabled =
    form.formState.isSubmitting || !form.formState.isValid || isFormDisabled;

  const shouldShowAvatar =
    avatar &&
    isURL(avatar) &&
    !form.formState.isValidating &&
    !form.formState.errors.avatar;

  const [updatedUserName, setUpdatedUserName] = useState(false);
  const [updatedUserNameEns, setUpdatedUserNameEns] = useState(false);
  useEffect(() => {
    if (updatedUserName || isLoading) return;

    if (userData?.user?.display_name) {
      console.log(
        "Setting display name from graphql",
        userData.user.display_name,
      );
      form.setValue("displayName", userData.user.display_name);
      setUpdatedUserName(true);
      return;
    }

    if (!updatedUserNameEns && ensName) {
      console.log("Setting display name from ENS", ensName);
      form.setValue("displayName", ensName);
      setUpdatedUserNameEns(true);
    }
  }, [
    displayName,
    ensName,
    form,
    userData,
    updatedUserName,
    updatedUserNameEns,
    isLoading,
  ]);

  const [updatedAvatar, setUpdatedAvatar] = useState(false);
  const [updatedEnsAvatar, setUpdatedEnsAvatar] = useState(false);
  useEffect(() => {
    if (updatedAvatar || isLoading) return;

    if (userData?.user?.avatar) {
      console.log("Setting avatar from graphql", userData?.user?.avatar);
      form.setValue("avatar", userData?.user?.avatar || "");
      setUpdatedAvatar(true);
      return;
    }

    if (!updatedEnsAvatar && ensAvatar) {
      console.log("Setting avatar from ENS", ensAvatar);
      form.setValue("avatar", ensAvatar);
      setUpdatedEnsAvatar(true);
    }
  }, [
    ensAvatar,
    avatar,
    form,
    userData,
    updatedAvatar,
    updatedEnsAvatar,
    isLoading,
  ]);

  // Reset form state when account changes
  useEffect(() => {
    form.reset();
    setUpdatedUserName(false);
    setUpdatedAvatar(false);
  }, [selectedAccount, form]);

  useEffect(() => {
    const checkPendingUpdates = async () => {
      console.log("checking for pending updates");
      if (selectedAccount?.type !== "safe" || !selectedAccount?.address) {
        setPendingUpdate(undefined);
        return;
      }

      if (userData?.pendingSignatures.length === 0) {
        setPendingUpdate(undefined);
        return;
      }
      const pendingMessage = userData?.pendingSignatures[0]?.message;
      setPendingUpdate(
        pendingMessage ? parsePendingUserUpdate(pendingMessage) : undefined,
      );
    };

    checkPendingUpdates();
  }, [selectedAccount, userData]);

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
                  <Input {...field} disabled={isFormDisabled} />
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
                  <Input {...field} disabled={isFormDisabled} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {shouldShowAvatar && (
            <>
              <FormLabel>Preview</FormLabel>
              <Image
                src={avatar}
                alt="Preview of the profile image"
                width={200}
                height={200}
                className="object-scale-down"
              />
            </>
          )}

          <Button disabled={isSubmitDisabled}>
            {(form.formState.isSubmitting || isPendingUpdateUser) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save changes
          </Button>
        </form>
      </Form>

      {pendingUpdate && (
        <PendingUpdateCard
          pendingUpdate={pendingUpdate}
          messageHash={userData?.pendingSignatures[0]?.message_hash}
          onUpdateCancelled={() => {
            setPendingUpdate(undefined);
            // Reset form with original values to make it editable again
            form.reset({
              displayName: form.getValues("displayName"),
              avatar: form.getValues("avatar"),
            });
          }}
        />
      )}
    </div>
  );
};
