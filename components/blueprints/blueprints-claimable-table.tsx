"use client";

import { BlueprintFragment } from "@/blueprints/blueprint.fragment";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import EthAddress from "@/components/eth-address";
import { fromUnixTime } from "date-fns";
import { BlueprintsTable } from "./blueprints-table";
import { Button } from "../ui/button";
import Link from "next/link";
import { TrashIcon } from "lucide-react";
import { useDeleteBlueprint } from "@/blueprints/hooks/deleteBlueprint";
import { ChainFactory } from "@/lib/chainFactory";

export const BlueprintsClaimableTable = ({
  blueprints,
  count,
}: {
  blueprints: BlueprintFragment[];
  count?: number | null;
}) => {
  const { mutate: deleteBlueprint } = useDeleteBlueprint();
  const columnHelper = createColumnHelper<BlueprintFragment>();
  const blueprintsCreatedColumns = [
    columnHelper.accessor("form_values.title", {
      header: "Title",
      cell: (row) => {
        return row.getValue();
      },
    }),
    columnHelper.accessor("admins", {
      header: "Sender",
      cell: (row) => {
        const address = row.getValue()[0].address;
        return <EthAddress address={address} />;
      },
    }),
    columnHelper.accessor("created_at", {
      header: "Created on",
      cell: (row) => {
        console.log(row.getValue());
        return fromUnixTime(Number(row.getValue()) / 1000)
          .toISOString()
          .split("T")[0];
      },
    }),
    columnHelper.accessor("admins", {
      header: "Chain",
      id: "chain",
      cell: (row) => {
        const admins = row.getValue();
        const chain = ChainFactory.getChain(Number(admins[0].chain_id));
        return (
          <div className="bg-slate-100 rounded-md px-2 py-1 w-fit cursor-default">
            {chain.name}
          </div>
        );
      },
    }),
    columnHelper.display({
      id: "action",
      cell: (row) => {
        return (
          <div className="flex justify-end space-x-2">
            <Button asChild>
              <Link href={`/hypercerts/new?blueprintId=${row.row.original.id}`}>
                Open
              </Link>
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                deleteBlueprint({ blueprintId: row.row.original.id })
              }
            >
              <TrashIcon className="w-4 h-4" />
            </Button>
          </div>
        );
      },
    }),
  ] as ColumnDef<BlueprintFragment>[];

  return (
    <BlueprintsTable
      columns={blueprintsCreatedColumns}
      blueprints={blueprints}
      count={count}
    />
  );
};
