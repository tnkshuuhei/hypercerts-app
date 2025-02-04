"use client";

import { ColumnDef } from "@tanstack/react-table";
import { createColumnHelper } from "@tanstack/react-table";
import { AllowListRecord } from "@/allowlists/getAllowListRecordsForAddressByClaimed";
import EthAddress from "@/components/eth-address";
import TimeFrame from "@/components/hypercert/time-frame";
import { ChainFactory } from "@/lib/chainFactory";
import { Checkbox } from "@/components/ui/checkbox";
import { UnclaimedTableDropdown } from "./unclaimed-table-dropdown";
import UnclaimedHypercertClaimButton from "../unclaimed-hypercert-claim-button";

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
    // TODO: get title from metadata
    cell: (row) => {
      return (
        <div className="max-w-[500px] truncate font-medium">
          {row.getValue()}
        </div>
      );
    },
  }),
  columnHelper.accessor("user_address", {
    header: "User Address",
    cell: (row) => {
      const address = row.getValue();
      return <EthAddress address={address} />;
    },
  }),
  columnHelper.accessor("hypercert_id", {
    header: "work timeframe",
    // TODO: get work timeframe from metadata
    cell: (row) => {
      return (
        // <TimeFrame
        //   from={metadata?.work_timeframe_from}
        //   to={metadata?.work_timeframe_to}
        // />
        <div>work timeframe</div>
      );
    },
  }),
  columnHelper.accessor("hypercert_id", {
    header: "Chain",
    id: "chain",
    cell: (row) => {
      const [chainId] = row.getValue()!.split("-");
      const chain = ChainFactory.getChain(Number(chainId));
      return (
        <div className="bg-slate-100 rounded-md px-2 py-1 w-fit cursor-default">
          {chain.name}
        </div>
      );
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
