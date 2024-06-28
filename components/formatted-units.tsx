"use client";

import React, { useEffect, useState } from "react";

import { isString } from "remeda";

export function FormattedUnits({ children }: { children: string | number }) {
  const [formatted, setFormatted] = useState<string | number>(children);

  useEffect(() => {
    let formattedValue: string | number = children;
    if (isString(children)) {
      formattedValue = Number.parseInt(children, 10);
    }

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      formattedValue = new Intl.NumberFormat(navigator.language, {
        notation: "compact",
        compactDisplay: "short",
      }).format(formattedValue as number);
    }

    setFormatted(formattedValue);
  }, [children]);

  return <>{formatted}</>;
}
