import EthAddress from "@/components/eth-address";
import { FormattedUnits } from "@/components/formatted-units";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import {
  decodeFractionalOrderParams,
  getCurrencyByAddress,
} from "@/marketplace/utils";
import { createColumnHelper } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";

const columnHelper = createColumnHelper<OrderFragment>();

export const createListingsColumns = ({
  displayCurrency,
}: {
  displayCurrency: string;
}) => {
  // Base columns that always show
  const baseColumns = [
    columnHelper.accessor("signer", {
      cell: (row) => (
        <div>
          <EthAddress address={row.getValue()} />
        </div>
      ),
      header: "Seller",
    }),
    columnHelper.accessor("pricePerPercentInUSD", {
      header: ({ column }) => (
        <div
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Price per %
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </div>
      ),
      cell: (row) => {
        if (displayCurrency === "token") {
          const { pricePerPercentInToken, currency, chainId } =
            row.row.original;
          const currencyData = getCurrencyByAddress(Number(chainId), currency);
          if (!currencyData) return <div>Unknown currency</div>;
          return (
            <div>
              {pricePerPercentInToken} {currencyData.symbol}
            </div>
          );
        }
        const price = Number(row.getValue());
        if (price < 0.01) return <div>{"<"} $0.01</div>;
        return <div>${price.toFixed(2)}</div>;
      },
      sortingFn: (rowA, rowB) =>
        Number(rowA.getValue("pricePerPercentInUSD")) <
        Number(rowB.getValue("pricePerPercentInUSD"))
          ? 1
          : -1,
    }),
    columnHelper.accessor("additionalParameters", {
      id: "minUnitsToBuy",
      header: "Min units per order",
      cell: (row) => {
        const params = row.getValue();
        try {
          const { minUnitAmount } = decodeFractionalOrderParams(
            params as `0x{string}`,
          );
          return <FormattedUnits>{minUnitAmount.toString()}</FormattedUnits>;
        } catch (e) {
          console.error(e);
          return <div>Invalid</div>;
        }
      },
    }),
    columnHelper.accessor("additionalParameters", {
      id: "maxUnitAmount",
      header: "Max units per order",
      cell: (row) => {
        const params = row.getValue();
        try {
          const { maxUnitAmount } = decodeFractionalOrderParams(
            params as `0x{string}`,
          );
          return <FormattedUnits>{maxUnitAmount.toString()}</FormattedUnits>;
        } catch (e) {
          console.error(e);
          return <div>Invalid</div>;
        }
      },
    }),
  ];

  return baseColumns;
};
