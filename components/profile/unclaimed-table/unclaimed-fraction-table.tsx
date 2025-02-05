"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  Row,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AllowListRecord } from "@/allowlists/getAllowListRecordsForAddressByClaimed";
import UnclaimedHypercertBatchClaimButton from "../unclaimed-hypercert-butchClaim-button";
import { TableToolbar } from "./table-toolbar";

export interface DataTableProps {
  columns: ColumnDef<AllowListRecord>[];
  data: readonly AllowListRecord[];
}

export function UnclaimedFractionTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedChain, setSelectedChain] = useState<number | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<AllowListRecord[]>([]);

  const getChainId = useCallback((hypercertId: string) => {
    const [chainId] = hypercertId.split("-");
    return Number(chainId);
  }, []);

  const isRowSelectable = useCallback(
    (row: Row<AllowListRecord>) => {
      const rowChainId = getChainId(row.original.hypercert_id!);
      return !selectedChain || selectedChain === rowChainId;
    },
    [selectedChain, getChainId],
  );

  const handleRowSelectionChange: OnChangeFn<RowSelectionState> = useCallback(
    (updaterOrValue) => {
      let updatedSelection: RowSelectionState;

      if (typeof updaterOrValue === "function") {
        updatedSelection = updaterOrValue(rowSelection);
      } else {
        updatedSelection = updaterOrValue;
      }

      const selectedRows = Object.entries(updatedSelection)
        .filter(([_, isSelected]) => isSelected)
        .map(([rowId]) => table.getRow(rowId));

      if (selectedRows.length > 0 && !selectedChain) {
        const firstRow = selectedRows[0];
        setSelectedChain(getChainId(firstRow.original.hypercert_id!));
      } else if (selectedRows.length === 0) {
        setSelectedChain(null);
      }

      setRowSelection(updatedSelection);
    },
    [selectedChain, getChainId, rowSelection],
  );

  const table = useReactTable({
    data: data as AllowListRecord[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    enableRowSelection: isRowSelectable,
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const getSelectedRecords = useCallback(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table]);

  useEffect(() => {
    setSelectedRecords(getSelectedRecords());
  }, [rowSelection, getSelectedRecords]);

  return (
    <div className="w-full">
      <div className="flex gap-2 items-center py-4">
        <UnclaimedHypercertBatchClaimButton
          allowListRecords={selectedRecords}
          selectedChainId={selectedChain}
        />
        <TableToolbar table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
    </div>
  );
}
