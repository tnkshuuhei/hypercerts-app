import { Currency, Taker } from "@hypercerts-org/marketplace-sdk";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

import { Button } from "@/components/ui/button";
import { SUPPORTED_CHAINS } from "@/configs/constants";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { decodeContractError } from "@/lib/decodeContractError";
import { generateBlockExplorerLink } from "@/lib/utils";

import { BuyFractionalStrategy } from "./BuyFractionalStrategy";
import { MarketplaceOrder } from "./types";
import { getCurrencyByAddress } from "./utils";

export class EOABuyFractionalStrategy extends BuyFractionalStrategy {
  async execute({
    order,
    unitAmount,
    pricePerUnit,
    hypercertName,
    totalUnitsInHypercert,
  }: {
    order: MarketplaceOrder;
    unitAmount: bigint;
    pricePerUnit: string;
    hypercertName?: string | null;
    totalUnitsInHypercert?: bigint;
  }) {
    const {
      setDialogStep: setStep,
      setSteps,
      setOpen,
      setExtraContent,
    } = this.dialogContext;
    if (!this.exchangeClient) {
      this.dialogContext.setOpen(false);
      throw new Error("No client");
    }

    if (!this.chainId) {
      this.dialogContext.setOpen(false);
      throw new Error("No chain id");
    }

    if (!this.walletClient.data) {
      this.dialogContext.setOpen(false);
      throw new Error("No wallet client data");
    }

    setSteps([
      {
        id: "Setting up order execution",
        description: "Setting up order execution",
      },
      {
        id: "ERC20",
        description: "Setting approval",
      },
      {
        id: "Transfer manager",
        description: "Approving transfer manager",
      },
      {
        id: "Awaiting buy signature",
        description: "Awaiting buy signature",
      },
      {
        id: "Awaiting confirmation",
        description: "Awaiting confirmation",
      },
    ]);
    setOpen(true);

    let currency: Currency | undefined;
    let takerOrder: Taker;
    try {
      await setStep("Setting up order execution");
      currency = getCurrencyByAddress(order.chainId, order.currency);

      if (!currency) {
        throw new Error(
          `Invalid currency ${order.currency} on chain ${order.chainId}`,
        );
      }

      takerOrder = this.exchangeClient.createFractionalSaleTakerBid(
        order,
        this.address,
        unitAmount.toString(),
        pricePerUnit,
      );
    } catch (e) {
      await setStep(
        "Setting up order execution",
        "error",
        e instanceof Error ? e.message : "Error setting up order execution",
      );
      console.error(e);
      throw new Error("Error setting up order execution");
    }

    if (!currency) {
      throw new Error(
        `Invalid currency ${order.currency} on chain ${order.chainId}`,
      );
    }

    const totalPrice = BigInt(order.price) * unitAmount;
    try {
      await setStep("ERC20");
      if (currency.address !== zeroAddress) {
        const currentAllowance = await this.getERC20Allowance(
          order.currency as `0x${string}`,
        );

        if (currentAllowance < totalPrice) {
          const approveTx = await this.exchangeClient.approveErc20(
            order.currency,
            totalPrice,
          );
          await waitForTransactionReceipt(this.walletClient.data, {
            hash: approveTx.hash as `0x${string}`,
          });
        }
      }
    } catch (e) {
      await setStep(
        "ERC20",
        "error",
        e instanceof Error ? e.message : "Approval error",
      );
      console.error(e);
      throw new Error("Approval error");
    }

    try {
      await setStep("Transfer manager");
      const isTransferManagerApproved =
        await this.exchangeClient.isTransferManagerApproved();
      // FIXME: this shouldn't be here, unless I'm missing something
      if (!isTransferManagerApproved) {
        const transferManagerApprove = await this.exchangeClient
          .grantTransferManagerApproval()
          .call();
        await waitForTransactionReceipt(this.walletClient.data, {
          hash: transferManagerApprove.hash as `0x${string}`,
        });
      }
    } catch (e) {
      await setStep(
        "Transfer manager",
        "error",
        e instanceof Error ? e.message : "Error approving transfer manager",
      );
      console.error(e);
      throw new Error("Approval error");
    }

    try {
      await setStep("Setting up order execution");
      const overrides =
        currency.address === zeroAddress ? { value: totalPrice } : undefined;
      const { call } = this.exchangeClient.executeOrder(
        order,
        takerOrder,
        order.signature,
        undefined,
        overrides,
      );
      await setStep("Awaiting buy signature");
      const tx = await call();
      await setStep("Awaiting confirmation");
      await waitForTransactionReceipt(this.walletClient.data, {
        hash: tx.hash as `0x${string}`,
      });
      const chain = SUPPORTED_CHAINS.find((x) => x.id === order.chainId);
      await setStep("Awaiting confirmation", "completed");
      const message =
        hypercertName && totalUnitsInHypercert !== undefined ? (
          <span>
            Congratulations, you successfully bought{" "}
            <b>
              {calculateBigIntPercentage(unitAmount, totalUnitsInHypercert)}%
            </b>{" "}
            of <b>{hypercertName}</b>.
          </span>
        ) : (
          "Your transaction was successful"
        );

      setExtraContent(() => (
        <div className="flex flex-col space-y-2">
          <p className="text-lg font-medium">Success</p>
          <p className="text-sm font-medium">{message}</p>
          <div className="flex space-x-4 py-4 justify-center">
            <Button
              onClick={() => {
                this.router.push(`/hypercerts/${order.hypercert_id}`);
                window.location.reload();
                setOpen(false);
              }}
            >
              View hypercert
            </Button>
            <Button asChild>
              <Link
                href={generateBlockExplorerLink(chain, tx.hash)}
                target="_blank"
              >
                View transaction <ExternalLink size={14} className="ml-2" />
              </Link>
            </Button>
          </div>
          <p className="text-sm font-medium">
            New ownership will not be immediately visible on the Hypercerts
            page, but will be visible in 5-10 minutes.
          </p>
        </div>
      ));
    } catch (e) {
      const decodedMessage = decodeContractError(e, "Error buying listing");
      await setStep("Awaiting confirmation", "error", decodedMessage);

      console.error(e);
      throw new Error(decodedMessage);
    }
  }
}
