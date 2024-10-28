"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DEFAULT_DISPLAY_CURRENCY } from "@/configs/hypercerts";

interface CurrencyButtonsProps {
  value?: string;
  className?: string;
}

export const CurrencyButtons = ({ value, className }: CurrencyButtonsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentValue = value || DEFAULT_DISPLAY_CURRENCY;

  const onClickCurrency = (currency: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("currency", currency);
    params.set("p", "1"); // Reset to first page when changing currency
    router.push(`?${params.toString()}`);
  };

  const sharedClasses = cn(
    "hover:text-white first:rounded-r-none last:rounded-l-none",
  );
  const inactiveClass = cn(
    "bg-white text-black border border-slate-300",
    sharedClasses,
  );
  const activeClass = cn("bg-black text-white", sharedClasses);

  return (
    <div className={cn("flex", className)}>
      <Button
        className={cn(currentValue === "usd" ? activeClass : inactiveClass)}
        onClick={() => onClickCurrency("usd")}
      >
        USD
      </Button>
      <Button
        className={cn(currentValue === "token" ? activeClass : inactiveClass)}
        onClick={() => onClickCurrency("token")}
      >
        Token
      </Button>
    </div>
  );
};
