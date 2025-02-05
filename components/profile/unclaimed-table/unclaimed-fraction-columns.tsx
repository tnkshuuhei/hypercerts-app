"use client";

import React from "react";
import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { AllowListRecord } from "@/allowlists/getAllowListRecordsForAddressByClaimed";
import TimeFrame from "@/components/hypercert/time-frame";
import { ChainFactory } from "@/lib/chainFactory";
import { Checkbox } from "@/components/ui/checkbox";
import { UnclaimedTableDropdown } from "./unclaimed-table-dropdown";
import UnclaimedHypercertClaimButton from "../unclaimed-hypercert-claim-button";
import { Badge } from "@/components/ui/badge";
import { FormattedUnits } from "@/components/formatted-units";

const columnHelper = createColumnHelper<AllowListRecord>();

export const UnclaimedFractionColumns = [
  columnHelper.accessor("id", {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  }),
  columnHelper.accessor("hypercert_id", {
    header: "Title",
    id: "hypercert_id",
    cell: ({ row }) => {
      const hypercertId = row.getValue("hypercert_id") as string;
      const [chainId] = hypercertId.split("-");
      const chain = ChainFactory.getChain(Number(chainId));
      // TODO: get title from metadata
      // TODO: get work timeframe from metadata

      return (
        <div className="flex items-center space-x-2">
          <Image
            src={`/api/hypercerts/${hypercertId}/image`}
            alt={hypercertId || ""}
            className="object-cover object-top w-[100px] h-[100px]"
            width={100}
            height={100}
          />
          <div className="flex flex-col">
            <div className="flex space-x-2">
              {chain && (
                <Badge variant="outline" className="w-max">
                  {chain.name}
                </Badge>
              )}
              <span className="max-w-[500px] truncate font-medium">
                {/* {metadata?.title} */}
                {hypercertId}
              </span>
            </div>
            {/* <TimeFrame
              from={metadata?.work_timeframe_from}
              to={metadata?.work_timeframe_to}
            /> */}
            <div>Jun 26, 2024 — Jun 27, 2024</div>
          </div>
        </div>
      );
    },
    filterFn: (
      row: { getValue: (columnId: string) => string },
      id: string,
      filterValue: string[],
    ) => {
      if (!filterValue?.length) return true;
      const [chainId] = row.getValue(id).split("-");
      const result = filterValue.includes(chainId);
      return result;
    },
  }),
  columnHelper.accessor("units", {
    header: "Claimable Units",
    cell: ({ row }) => {
      const units = row.getValue("units");
      return <FormattedUnits>{units as string}</FormattedUnits>;
    },
  }),
  columnHelper.accessor("total_units", {
    header: "Total Units",
    cell: ({ row }) => {
      const totalUnits = row.getValue("total_units");
      return <FormattedUnits>{totalUnits as string}</FormattedUnits>;
    },
  }),
  columnHelper.display({
    id: "action",
    cell: ({ row }) => {
      return <UnclaimedHypercertClaimButton allowListRecord={row} />;
    },
  }),
  columnHelper.display({
    id: "action",
    cell: ({ row }) => {
      return <UnclaimedTableDropdown row={row} />;
    },
  }),
] as ColumnDef<AllowListRecord>[];
