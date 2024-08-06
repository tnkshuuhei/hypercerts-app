import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { type TransactionStatus } from "@/contexts/TransactionProvider";
import { useMediaQuery } from "@/hooks/use-media-query";

const TransactionProcessingDialog = ({
  isProcessing,
  txnStatus,
  txnLabel,
}: {
  isProcessing: boolean;
  txnStatus: TransactionStatus;
  txnLabel: string;
}) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  if (isDesktop)
    return (
      <Dialog open={isProcessing} onOpenChange={() => {}}>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground" />
        <DialogContent>
          <DialogTitle>
            <h2 className="text-lg font-semibold">
              {txnLabel ?? "Transaction status"}: {txnStatus}
            </h2>
          </DialogTitle>
          <section>
            {txnStatus === "pending" && <p>Waiting for confirmation...</p>}
            {txnStatus === "processing" && <p>Processing transaction...</p>}
            {txnStatus === "success" && <p>Transaction successful!</p>}
          </section>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={isProcessing} onClose={() => {}}>
      <DrawerContent className="p-4">
        <h2 className="text-lg font-semibold">
          {txnLabel ?? "Transaction status"}:{txnStatus}
        </h2>
        {txnStatus === "pending" && <p>Waiting for confirmation...</p>}
        {txnStatus === "processing" && <p>Processing transaction...</p>}
        {txnStatus === "success" && <p>Transaction successful!</p>}
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionProcessingDialog;
