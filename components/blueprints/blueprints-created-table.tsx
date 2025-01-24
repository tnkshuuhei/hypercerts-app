"use client";

import { BlueprintFragment } from "@/blueprints/blueprint.fragment";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import EthAddress from "@/components/eth-address";
import CopyableText from "@/components/copyable-text";
import { fromUnixTime } from "date-fns";
import { BlueprintsTable } from "./blueprints-table";

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
