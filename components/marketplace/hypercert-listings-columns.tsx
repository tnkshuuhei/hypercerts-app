import { createColumnHelper } from "@tanstack/react-table";
import { OrderFragment } from "@/marketplace/fragments/order.fragment";
import EthAddress from "@/components/eth-address";
import { FormattedUnits } from "@/components/formatted-units";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  decodeFractionalOrderParams,
  getCurrencyByAddress,
} from "@/marketplace/utils";
import { ArrowUpDown, RefreshCwIcon, TrashIcon, XIcon } from "lucide-react";
import { OrderValidatorCode } from "@hypercerts-org/marketplace-sdk";
import { CancelOrderParams, DeleteOrderParams } from "@/marketplace/hooks";

const columnHelper = createColumnHelper<OrderFragment>();

export const createListingsColumns = ({
  address,
  chainId,
  displayCurrency,
  hypercertOnConnectedChain,
  refreshOrderValidity,
  cancelOrder,
  deleteOrder,
  onRowClick,
}: {
  address: string;
  chainId: number;
  displayCurrency: string;
  hypercertOnConnectedChain: boolean;
  refreshOrderValidity: (tokenId: string) => Promise<void>;
  cancelOrder: (params: CancelOrderParams) => Promise<void>;
  deleteOrder: (params: DeleteOrderParams) => Promise<void>;
  onRowClick: (order: OrderFragment) => void;
}) => [
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
        const { pricePerPercentInToken, currency, chainId } = row.row.original;
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
  columnHelper.accessor("id", {
    id: "buy",
    header: "Action",
    cell: (row) => {
      const order = row.row.original;
      if (order.signer === address || order.invalidated) return null;
      return (
        <Button
          onClick={() => onRowClick(order)}
          disabled={!hypercertOnConnectedChain}
          className="w-full"
        >
          Buy
        </Button>
      );
    },
  }),
  columnHelper.accessor("invalidated", {
    id: "invalidated",
    header: "Invalidated",
    cell: (row) => {
      const order = row.row.original;
      if (order.signer !== address) return <div></div>;
      return (
        <div className="flex">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="ml-2"
                  size="sm"
                  onClick={() => refreshOrderValidity(order.itemIds[0])}
                >
                  <RefreshCwIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                This listing has been evaluated to be invalid. You can refresh
                the listing status by clicking the refresh icon.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      );
    },
  }),
  columnHelper.accessor("orderNonce", {
    id: "cancel-order",
    header: "Cancel",
    cell: (row) => {
      const nonce = BigInt(row.getValue());
      const order = row.row.original;
      if (order.signer !== address) return <div></div>;

      const cancelDisabled = Number(order.chainId) !== chainId;
      const isCancelled = order.validator_codes?.includes(
        OrderValidatorCode.USER_ORDER_NONCE_EXECUTED_OR_CANCELLED.toString(),
      );

      if (order.signer === address) {
        if (!isCancelled) {
          return (
            <div className="flex">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      disabled={cancelDisabled}
                      className="ml-2"
                      onClick={async (e) => {
                        e.preventDefault();
                        await cancelOrder({
                          nonce,
                          chainId: Number(order.chainId),
                          tokenId: order.itemIds[0],
                          hypercertId: order.hypercert_id,
                          ownerAddress: order.signer,
                        });
                      }}
                      size="sm"
                    >
                      <XIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[300px]">
                    {cancelDisabled
                      ? "Connect to the correct chain to invalidate the listing."
                      : "Invalidate the listing permanently."}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          );
        }

        return (
          <div className="flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="ml-2"
                    onClick={async (e) => {
                      e.preventDefault();
                      await deleteOrder({
                        orderId: order.id,
                        hypercertId: order.hypercert_id,
                        ownerAddress: order.signer,
                      });
                    }}
                    size="sm"
                  >
                    <TrashIcon />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="max-w-[300px]">
                  Click to permanently remove listing.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      }
    },
  }),
];
