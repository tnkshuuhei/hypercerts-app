import { formatDistanceToNow } from "date-fns";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PendingUserUpdate } from "@/settings/pending-user-update-parser";
import { useToast } from "@/components/ui/use-toast";
import { useCancelSignatureRequest } from "@/safe/signature-requests/useCancelSignatureRequest";
import { useAccountStore } from "@/lib/account-store";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const ERROR_TOAST_DURATION = 5000;
const REFRESH_DURATION = 1500;

interface PendingUpdateCardProps {
  pendingUpdate: PendingUserUpdate;
  messageHash: string | undefined;
  onUpdateCancelled: () => void;
}

export const PendingUpdateCard = ({
  pendingUpdate,
  messageHash,
  onUpdateCancelled,
}: PendingUpdateCardProps) => {
  const { selectedAccount } = useAccountStore();
  const { toast } = useToast();
  const cancelSignatureRequest = useCancelSignatureRequest();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const handleRefreshSignatures = async () => {
    try {
      setIsRefreshing(true);
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, REFRESH_DURATION)),
        queryClient.invalidateQueries({
          queryKey: ["user", selectedAccount?.address],
        }),
      ]);
    } catch (error) {
      console.error("Failed to refresh signatures:", error);
      toast({
        title: "Error",
        description: "Failed to refresh signature requests",
        variant: "destructive",
        duration: ERROR_TOAST_DURATION,
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelUpdate = async () => {
    if (
      !selectedAccount?.address ||
      cancelSignatureRequest.isPending ||
      !messageHash
    )
      return;

    try {
      await cancelSignatureRequest.mutateAsync({
        safeAddress: selectedAccount.address,
        messageHash,
      });
      onUpdateCancelled();
    } catch (error) {
      console.error("Failed to cancel signature request:", error);
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900 dark:bg-yellow-950">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-between flex-1">
          <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
            Pending Update
          </h3>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-purple-900 px-2 py-1 text-xs font-medium text-yellow-200">
              {formatDistanceToNow(
                new Date(pendingUpdate.metadata.timestamp * 1000),
                {
                  addSuffix: true,
                },
              )}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefreshSignatures}
              disabled={isRefreshing}
              className="h-8 w-8 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-900"
            >
              <RefreshCw
                className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-3 py-2">
        <div className="flex flex-col">
          <span className="text-xs text-yellow-700 dark:text-yellow-300">
            Display Name
          </span>
          <span className="font-medium text-yellow-900 dark:text-yellow-100">
            {pendingUpdate.user.displayName}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-xs text-yellow-700 dark:text-yellow-300">
            Image URL
          </span>
          <span className="font-medium text-yellow-900 dark:text-yellow-100 break-all">
            {pendingUpdate.user.avatar}
          </span>
        </div>
      </div>

      <p className="text-yellow-800 dark:text-yellow-200">
        The changes will be applied once all required signatures are collected.
      </p>
      {messageHash && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCancelUpdate}
          className="mt-2 w-fit border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-900"
        >
          Cancel pending update
        </Button>
      )}
    </div>
  );
};
