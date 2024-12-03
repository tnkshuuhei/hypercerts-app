"use client";

import { useCallback } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { DEFAULT_DISPLAY_CURRENCY } from "@/configs/hypercerts";
import { useHypercertExchangeClient } from "@/hooks/use-hypercert-exchange-client";
import { CancelOrderParams, useCancelOrder } from "@/marketplace/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BuyOrderDialog } from "./buy-order-dialog";
import { createListingsColumns } from "./hypercert-listings-columns";
import { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";

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

  const displayCurrency = searchParams?.currency || DEFAULT_DISPLAY_CURRENCY;

  const hypercertOnConnectedChain = Number(chainId) === connectedChainId;

  const handleDialogClose = useCallback(() => {
    router.refresh();
  }, [router]);

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
      await cancelOrderMutation(params);
    },
    [cancelOrderMutation],
  );

  const columns = createListingsColumns({
    address: address || "",
    chainId: Number(chainId),
    displayCurrency,
    refreshOrderValidity,
    cancelOrder,
  });

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
              <TableCell>
                {row.original.signer !== address &&
                  !row.original.invalidated && (
                    <BuyOrderDialog
                      order={row.original}
                      hypercert={initialHypercert}
                      onClose={handleDialogClose}
                      trigger={
                        <Button
                          disabled={!hypercertOnConnectedChain}
                          className="w-full"
                        >
                          Buy
                        </Button>
                      }
                    />
                  )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
