"use client";

import { useMemo, useState } from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useAccount, useChainId } from "wagmi";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { DEFAULT_DISPLAY_CURRENCY } from "@/configs/hypercerts";
import { useHypercertClient } from "@/hooks/use-hypercert-client";
import { useHypercertExchangeClient } from "@/hooks/use-hypercert-exchange-client";
import { useCancelOrder, useDeleteOrder } from "@/marketplace/hooks";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
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

export default function HypercertListingsList({
  initialOrders,
  hypercertId,
  initialHypercert,
}: {
  initialOrders?: OrderFragment[];
  hypercertId: string;
  initialHypercert: HypercertFull;
}) {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<OrderFragment | null>(
    null,
  );
  const { client: hypercertExchangeClient } = useHypercertExchangeClient();
  const { client } = useHypercertClient();
  const chainId = useChainId();
  const { address } = useAccount();
  const searchParams = useSearchParams();

  const urlSearchParams = new URLSearchParams(searchParams);
  const displayCurrency =
    urlSearchParams.get("currency") || DEFAULT_DISPLAY_CURRENCY;

  const hypercertOnConnectedChain =
    client?.isClaimOrFractionOnConnectedChain(hypercertId) || false;

  const ordersVisibleToCurrentUser = useMemo(() => {
    return (
      orders?.filter((order) =>
        order.invalidated ? order.signer === address : true,
      ) || []
    );
  }, [orders, address]);

  const refreshOrderValidity = async (tokenId: string) => {
    if (!hypercertExchangeClient || !chainId) {
      console.log("No hypercert exchange client or invalid chain ID");
      return;
    }
    await hypercertExchangeClient.api.updateOrderValidity(
      [BigInt(tokenId)],
      chainId,
    );
  };

  const { mutateAsync: cancelOrder } = useCancelOrder();
  const { mutateAsync: deleteOrder } = useDeleteOrder();

  const columns = createListingsColumns({
    address: address || "",
    chainId,
    displayCurrency,
    hypercertOnConnectedChain,
    refreshOrderValidity,
    cancelOrder,
    deleteOrder,
    onRowClick: (order: OrderFragment) =>
      setSelectedOrder((current) => (current === order ? null : order)),
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data: ordersVisibleToCurrentUser,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      sorting,
      pagination,
    },
  });

  if (!orders?.length) {
    return <div>No listings yet.</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className={cn({
                      "bg-red-100": row.original.invalidated,
                    })}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No listings available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      {selectedOrder && (
        <BuyOrderDialog
          order={selectedOrder}
          hypercert={initialHypercert}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
