"use client";

import { Button } from "@/components/ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export const CurrencyButtons = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const urlSearchParams = new URLSearchParams(searchParams);
  const value = urlSearchParams.get("currency") || "USD";

  const onClickCurrency = (currency: string) => {
    urlSearchParams.set("currency", currency);
    router.push(`${pathname}?${urlSearchParams.toString()}`);
  };

  const sharedClasses = cn(
    "hover:text-white first:rounded-r-none last:rounded-l-none",
  );
  const inactiveClass = cn(
    "bg-white text-black border border-gray-300",
    sharedClasses,
  );
  const activeClass = cn("bg-black text-white", sharedClasses);

  return (
    <div className={cn("flex", className)}>
      <Button
        className={cn(value === "usd" ? activeClass : inactiveClass)}
        onClick={() => onClickCurrency("usd")}
      >
        USD
      </Button>
      <Button
        className={cn(value === "token" ? activeClass : inactiveClass)}
        onClick={() => onClickCurrency("token")}
      >
        Token
      </Button>
    </div>
  );
};
