import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignTypedData } from "wagmi";
import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import { hypercertApiSigningDomain } from "@/configs/constants";
import { HYPERCERTS_API_URL_REST } from "@/configs/hypercerts";
import { revalidatePathServerAction } from "@/app/actions/revalidatePathServerAction";

export interface BlueprintDeleteRequest {
  signature: string;
  chain_id: number;
  admin_address: string;
}

export const useDeleteBlueprint = () => {
  const { address, chainId } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();
  const {
    setDialogStep: setStep,
    setSteps,
    setOpen,
    setExtraContent,
  } = useStepProcessDialogContext();

  return useMutation({
    mutationKey: ["deleteBlueprint"],
    mutationFn: async ({ blueprintId }: { blueprintId: number }) => {
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
          id: "Deleting blueprint",
          description: "Deleting blueprint",
        },
      ]);
      setOpen(true);

      await setStep("Awaiting signature");
      let signature: string;

      try {
        signature = await signTypedDataAsync({
          account: address,
          domain: hypercertApiSigningDomain(chainId),
          types: {
            Blueprint: [{ name: "id", type: "uint256" }],
            BlueprintDeleteRequest: [{ name: "blueprint", type: "Blueprint" }],
          },
          primaryType: "BlueprintDeleteRequest",
          message: {
            blueprint: { id: BigInt(blueprintId) },
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
        return null;
      }

      await setStep("Deleting blueprint");

      try {
        const body: BlueprintDeleteRequest = {
          signature: signature as `0x${string}`,
          chain_id: chainId,
          admin_address: address as `0x${string}`,
        };
        await fetch(`${HYPERCERTS_API_URL_REST}/blueprints/${blueprintId}`, {
          method: "DELETE",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }).then((res) => {
          if (!res.ok) {
            throw new Error("Error deleting blueprint");
          }
        });
        setExtraContent(
          <div className="flex flex-col spacy-y-2">
            <p className="text-sm font-medium">
              Blueprint deleted successfully
            </p>
          </div>,
        );
        await setStep("Deleting blueprint", "completed");
        await revalidatePathServerAction([
          "/blueprints",
          `/profile/${address}`,
          { path: `/`, type: "layout" },
        ]);
        setTimeout(() => {
          setOpen(false);
        }, 2000);
      } catch (error) {
        await setStep(
          "Deleting blueprint",
          "error",
          error instanceof Error ? error.message : "Error deleting blueprint",
        );
      }
    },
  });
};
