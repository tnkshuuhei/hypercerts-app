"use client";

import { BlueprintFragment } from "@/blueprints/blueprint.fragment";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import EthAddress from "@/components/eth-address";
import CopyableText from "@/components/copyable-text";
import { fromUnixTime } from "date-fns";
import { BlueprintsTable } from "./blueprints-table";
import { ChainFactory } from "@/lib/chainFactory";

export const BlueprintsCreatedTable = ({
  blueprints,
  count,
}: {
  blueprints: BlueprintFragment[];
  count?: number | null;
}) => {
  const columnHelper = createColumnHelper<BlueprintFragment>();

  const blueprintsCreatedColumns = [
    columnHelper.accessor("id", {
      header: "ID",
      cell: (row) => {
        return <CopyableText text={row.getValue().toString()} />;
      },
    }),
    columnHelper.accessor("form_values.title", {
      header: "Title",
      cell: (row) => {
        return row.getValue();
      },
    }),
    columnHelper.accessor("minted", {
      header: "Minted",
      cell: (row) => {
        return row.getValue() ? "Yes" : "No";
      },
    }),
    columnHelper.accessor("minter_address", {
      header: "Minter",
      cell: (row) => {
        return <EthAddress address={row.getValue()} />;
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
    columnHelper.accessor("created_at", {
      header: "Created on",
      cell: (row) => {
        console.log(row.getValue());
        return fromUnixTime(Number(row.getValue()) / 1000)
          .toISOString()
          .split("T")[0];
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
