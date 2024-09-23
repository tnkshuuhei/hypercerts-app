import { useMutation } from "@tanstack/react-query";
import { useAccount, useSignMessage } from "wagmi";
import { SettingsFormValues } from "@/components/settings/settings-form";
import { useStepProcessDialogContext } from "@/components/global/step-process-dialog";
import { HYPERCERTS_API_URL_REST } from "@/configs/hypercerts";

export const useAddOrUpdateUser = () => {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
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
      const message = `Updating user: ${address}`;
      let signature: string;

      try {
        signature = await signMessageAsync({
          message,
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
            message,
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
