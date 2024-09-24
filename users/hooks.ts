import { useMutation, useQuery } from "@tanstack/react-query";
import { useAccount, useSignTypedData } from "wagmi";
import { SettingsFormValues } from "@/components/settings/settings-form";
import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import {
  HYPERCERTS_API_URL_GRAPH,
  HYPERCERTS_API_URL_REST,
} from "@/configs/hypercerts";
import { graphql, readFragment } from "@/lib/graphql";
import { UserFragment } from "@/users/fragments/user.fragments";
import request from "graphql-request";
import revalidatePathServerAction from "@/app/actions";

export const useAddOrUpdateUser = () => {
  const { address, chainId } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const {
    setDialogStep: setStep,
    setSteps,
    setOpen,
  } = useStepProcessDialogContext();
  return useMutation({
    mutationKey: ["addOrUpdateUser", address],
    mutationFn: async (user: SettingsFormValues) => {
      if (!address) {
        throw new Error("No address found");
      }

      if (!chainId) {
        throw new Error("No chainId found");
      }

      setSteps([
        {
          id: "Awaiting signature",
          description: "Awaiting signature",
        },
        {
          id: "Updating user",
          description: "Updating user",
        },
      ]);
      setOpen(true);

      await setStep("Awaiting signature");

      let signature: string;

      try {
        signature = await signTypedDataAsync({
          account: address,
          types: {
            User: [
              { name: "display_name", type: "string" },
              { name: "avatar", type: "string" },
            ],
            UpdateRequest: [
              { name: "user", type: "User" },
              { name: "chainId", type: "uint256" },
              { name: "address", type: "address" },
            ],
          },
          primaryType: "UpdateRequest",
          message: {
            user: {
              display_name: user.displayName || "",
              avatar: user.avatar || "",
            },
            chainId: BigInt(chainId),
            address,
          },
        });
        if (!signature) {
          throw new Error("No signature found");
        }
      } catch (error) {
        await setStep(
          "Awaiting signature",
          "error",
          error instanceof Error ? error.message : "Error signing message",
        );
        return;
      }

      await setStep("Updating user");

      try {
        await fetch(`${HYPERCERTS_API_URL_REST}/users/${address}`, {
          method: "POST",
          body: JSON.stringify({
            display_name: user.displayName,
            avatar: user.avatar,
            signature,
            chain_id: chainId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Error updating user");
          }
        });
        await setStep("Updating user", "completed");
        await revalidatePathServerAction("/settings");
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      } catch (error) {
        await setStep(
          "Updating user",
          "error",
          error instanceof Error ? error.message : "Error updating user",
        );
      }
    },
  });
};

export const useGetUser = ({ address }: { address?: string }) => {
  return useQuery({
    queryKey: ["user", address],
    queryFn: async () => {
      if (!address) {
        return null;
      }
      const query = graphql(
        `
          query UserQuery($address: String!) {
            users(where: { address: { eq: $address } }) {
              count
              data {
                ...UserFragment
              }
            }
          }
        `,
        [UserFragment],
      );
      const res = await request(HYPERCERTS_API_URL_GRAPH, query, {
        address,
      });
      const userFragment = res.users?.data?.[0];
      if (!userFragment) {
        return undefined;
      }

      return readFragment(UserFragment, userFragment);
    },
    enabled: !!address,
  });
};
