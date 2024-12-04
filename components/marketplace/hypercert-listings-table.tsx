"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_DISPLAY_CURRENCY } from "@/configs/hypercerts";
import { useHypercertExchangeClient } from "@/hooks/use-hypercert-exchange-client";
import { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { cn } from "@/lib/utils";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import { CancelOrderParams, useCancelOrder } from "@/marketplace/hooks";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { XIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { createListingsColumns } from "./hypercert-listings-columns";
import { BuyOrderDialog } from "./buy-order-dialog";

export default function HypercertListingsTable({
  orders,
  hypercertId,
  initialHypercert,
  searchParams,
}: {
  orders: OrderFragment[];
  hypercertId: string;
  initialHypercert: HypercertFull;
  searchParams: Record<string, string>;
}) {
  const { client: hypercertExchangeClient } = useHypercertExchangeClient();
  const { address, chainId: connectedChainId } = useAccount();
  const [chainId] = hypercertId.split("-");
  const router = useRouter();
  const { toast } = useToast();
  const [activeOrderNonce, setActiveOrderNonce] = useState<string | null>(null);
  const [cancellingOrderNonce, setCancellingOrderNonce] = useState<
    string | null
  >(null);

  const displayCurrency = searchParams?.currency || DEFAULT_DISPLAY_CURRENCY;

  const refreshOrderValidity = async (tokenId: string) => {
    if (!hypercertExchangeClient || !connectedChainId) {
      console.log("No hypercert exchange client or invalid chain ID");
      return;
    }
    await hypercertExchangeClient.api.updateOrderValidity(
      [BigInt(tokenId)],
      connectedChainId,
    );
  };

  const { mutateAsync: cancelOrderMutation } = useCancelOrder();

  const cancelOrder = useCallback(
    async (params: CancelOrderParams) => {
      setCancellingOrderNonce(params.nonce.toString());
      try {
        await cancelOrderMutation(params);
        toast({
          title: "Order cancelled",
          description: "Your order has been successfully cancelled.",
        });
      } catch (error) {
        console.error("Error cancelling order:", error);
        toast({
          title: "Error",
          description:
            "There was an error cancelling your order. Please try again.",
          variant: "destructive",
        });
      } finally {
        setCancellingOrderNonce(null);
        router.refresh();
      }
    },
    [cancelOrderMutation, toast, router],
  );

  const handleBuyOrder = useCallback(
    (orderNonce: string) => {
      setActiveOrderNonce(orderNonce);
      toast({
        title: "Transaction in progress",
        description: "Your buy order is being processed.",
      });
    },
    [toast],
  );

  const handleBuyOrderComplete = useCallback(() => {
    setActiveOrderNonce(null);
    toast({
      title: "Transaction complete",
      description: "Your buy order has been processed successfully.",
    });
    router.refresh();
  }, [router, toast]);

  const columns = [
    ...createListingsColumns({ displayCurrency }),
    {
      id: "action",
      cell: (row: any) => {
        const order = row.row.original;
        const isOwner = address && order.signer === address;
        const isProcessing = order.orderNonce === activeOrderNonce;
        const isCancelling = order.orderNonce === cancellingOrderNonce;

        if (order.invalidated) return null;

        if (isOwner && cancelOrder) {
          return (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    disabled={
                      order.chainId !== chainId ||
                      !!activeOrderNonce ||
                      !!cancellingOrderNonce
                    }
                    onClick={async () => {
                      await cancelOrder({
                        nonce: BigInt(order.orderNonce),
                        chainId: Number(order.chainId),
                        tokenId: order.itemIds[0],
                        hypercertId: order.hypercert_id,
                        ownerAddress: order.signer,
                      });
                    }}
                  >
                    {isCancelling ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XIcon />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  {order.chainId !== chainId
                    ? "Connect to the correct chain to invalidate the listing."
                    : !!activeOrderNonce || !!cancellingOrderNonce
                      ? "Cannot invalidate while a transaction is in progress."
                      : "Invalidate the listing permanently."}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          );
        }

        return (
          <BuyOrderDialog
            order={order}
            hypercert={initialHypercert}
            isProcessing={isProcessing}
            onBuyOrder={handleBuyOrder}
            onComplete={handleBuyOrderComplete}
            trigger={
              isProcessing ? (
                <Button disabled>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Processing
                </Button>
              ) : (
                <Button
                  disabled={
                    !address ||
                    order.chainId !== chainId ||
                    !!activeOrderNonce ||
                    !!cancellingOrderNonce
                  }
                >
                  {!address ? "Connect wallet" : "Buy"}
                </Button>
              )
            }
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="rounded-md border w-full">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
              className={cn({
                "bg-red-100": row.original.invalidated,
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
