"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import { BuyFractionalOrderForm } from "./buy-fractional-order-form";
import { orderFragmentToMarketplaceOrder } from "@/marketplace/utils";
import { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";

interface BuyOrderDialogProps {
  order: OrderFragment;
  hypercert: HypercertFull;
  onClose: () => void;
}

export function BuyOrderDialog({
  order,
  hypercert,
  onClose,
}: BuyOrderDialogProps) {
  const marketplaceOrder = orderFragmentToMarketplaceOrder(order);

  return (
    <Dialog open={true} onOpenChange={onClose}>
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
