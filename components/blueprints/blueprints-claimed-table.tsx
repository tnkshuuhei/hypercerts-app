"use client";

import { BlueprintFragment } from "@/blueprints/blueprint.fragment";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React from "react";
import EthAddress from "@/components/eth-address";
import { fromUnixTime } from "date-fns";
import { BlueprintsTable } from "./blueprints-table";

export const BlueprintsClaimedTable = ({
  blueprints,
  count,
}: {
  blueprints: BlueprintFragment[];
  count?: number | null;
}) => {
  console.log(blueprints);
  const columnHelper = createColumnHelper<BlueprintFragment>();

  const blueprintsClaimedColumns = [
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
  ] as ColumnDef<BlueprintFragment>[];

  return (
    <BlueprintsTable
      columns={blueprintsClaimedColumns}
      blueprints={blueprints}
      count={count}
    />
  );
};
