import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import { BuyFractionalOrderForm } from "./buy-fractional-order-form";
import { orderFragmentToMarketplaceOrder } from "@/marketplace/utils";
import { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface BuyOrderDialogProps {
  order: OrderFragment;
  hypercert: HypercertFull;
  onBuyOrder: (orderId: string) => void;
  onComplete: () => void;
  isProcessing: boolean;
  trigger: React.ReactNode;
}

export function BuyOrderDialog({
  order,
  hypercert,
  onComplete,
  onBuyOrder,
  isProcessing,
  trigger,
}: BuyOrderDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const marketplaceOrder = orderFragmentToMarketplaceOrder(order);

  const handleClose = () => {
    setIsOpen(false);
    onComplete();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Hypercert Fraction</DialogTitle>
        </DialogHeader>
        {isProcessing ? (
          <div className="flex items-center justify-center p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Processing transaction...</span>
          </div>
        ) : (
          <BuyFractionalOrderForm
            order={marketplaceOrder}
            hypercert={hypercert}
            onCompleted={handleClose}
            onBuyOrder={onBuyOrder}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
