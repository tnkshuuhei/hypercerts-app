import { Button, buttonVariants } from "@/components/ui/button";
import { createElement } from "react";
import type { Chain, TransactionReceipt } from "viem";
import { generateBlockExplorerLink } from "@/lib/utils";

export const createExtraContent = (
  receipt: TransactionReceipt,
  hypercertId?: string,
  chain?: Chain,
) => {
  const receiptButton =
    receipt &&
    createElement(
      "a",
      {
        href: generateBlockExplorerLink(chain, receipt.transactionHash),
        target: "_blank",
        rel: "noopener noreferrer",
      },
      createElement(
        Button,
        {
          size: "default",
          className: buttonVariants({ variant: "secondary" }),
        },
        "View transaction",
      ),
    );

  const hypercertButton =
    hypercertId &&
    createElement(
      "a",
      {
        href: `/hypercerts/${hypercertId}`,
        target: "_blank",
        rel: "noopener noreferrer",
      },
      createElement(
        Button,
        {
          size: "default",
          className: buttonVariants({ variant: "default" }),
        },
        "View hypercert",
      ),
    );

  return createElement(
    "div",
    { className: "flex flex-col space-y-2" },
    createElement(
      "p",
      { className: "text-sm font-medium" },
      "Your hypercert has been minted successfully!",
    ),
    createElement(
      "div",
      { className: "flex space-x-4" },
      receiptButton,
      hypercertButton,
    ),
  );
};
