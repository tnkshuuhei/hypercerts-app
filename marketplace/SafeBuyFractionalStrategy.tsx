import { Currency, Taker } from "@hypercerts-org/marketplace-sdk";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { zeroAddress } from "viem";
import { waitForTransactionReceipt } from "viem/actions";

import { Button } from "@/components/ui/button";
import { SUPPORTED_CHAINS } from "@/configs/constants";
import { calculateBigIntPercentage } from "@/lib/calculateBigIntPercentage";
import { decodeContractError } from "@/lib/decodeContractError";
import { generateBlockExplorerLink, generateSafeAppLink } from "@/lib/utils";

import { BuyFractionalStrategy } from "./BuyFractionalStrategy";
import { MarketplaceOrder } from "./types";
import { getCurrencyByAddress } from "./utils";

export class SafeBuyFractionalStrategy extends BuyFractionalStrategy {
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

    // TODO: we might have to change some steps here
    setSteps([
      {
        id: "Setting up order execution",
        description: "Setting up order execution",
      },
      {
        id: "ERC20",
        description: "Setting approval on Safe",
      },
      {
        id: "Transfer manager",
        description: "Approving transfer manager on Safe",
      },
      {
        id: "Submitting order",
        description: "Submitting buy transaction to Safe transaction queue",
      },
      {
        id: "Transaction queued",
        description: "Transaction(s) queued on Safe",
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

        // TODO: if this is not approved yet, we need to create a Safe TX and drop out of this
        // dialog early, so that the next invocation runs through this check without stopping.
        if (currentAllowance < totalPrice) {
          console.debug("Approving ERC20");
          await this.exchangeClient.approveErc20Safe(
            this.address,
            order.currency,
            totalPrice,
          );
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

    // TODO: this whole step should probably not be here
    try {
      await setStep("Transfer manager");
      const isTransferManagerApproved =
        await this.exchangeClient.isTransferManagerApproved();
      // FIXME: this shouldn't be here, unless we're missing something
      if (!isTransferManagerApproved) {
        console.debug("Approving transfer manager");
        await this.exchangeClient.grantTransferManagerApprovalSafe(
          this.address,
        );
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
      await setStep("Submitting order");
      const overrides =
        currency.address === zeroAddress ? { value: totalPrice } : undefined;
      await this.exchangeClient.executeOrderSafe(
        this.address,
        order,
        takerOrder,
        order.signature,
        overrides,
      );

      await setStep("Transaction queued");

      const chain = SUPPORTED_CHAINS.find((x) => x.id === order.chainId);

      const message = (
        <span>
          Transaction requests are submitted to the connected Safe.
          <br />
          <br />
          You can view the transactions in the Safe application
        </span>
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
                href={generateSafeAppLink(chain, this.address)}
                target="_blank"
              >
                View Safe <ExternalLink size={14} className="ml-2" />
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
