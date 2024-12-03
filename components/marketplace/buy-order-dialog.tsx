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

interface BuyOrderDialogProps {
  order: OrderFragment;
  hypercert: HypercertFull;
  onClose: () => void;
  trigger: React.ReactNode; // Add trigger prop
}

export function BuyOrderDialog({
  order,
  hypercert,
  onClose,
  trigger,
}: BuyOrderDialogProps) {
  const marketplaceOrder = orderFragmentToMarketplaceOrder(order);

  return (
    <Dialog onOpenChange={onClose}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Hypercert Fraction</DialogTitle>
        </DialogHeader>
        <BuyFractionalOrderForm
          order={marketplaceOrder}
          hypercert={hypercert}
          onCompleted={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
