"use client";

import React, { useEffect, useState } from "react";
import { isString } from "remeda";

interface FormattedUnitsProps {
  children: string | number | null | undefined;
  decimals?: number;
}

export function FormattedUnits({
  children,
  decimals = 0,
}: FormattedUnitsProps) {
  const [formattedUnits, setFormattedUnits] = useState<
    string | number | null | undefined
  >(children);

  useEffect(() => {
    let units = children;

    if (!units) return;
    if (isString(units)) {
      units = Number.parseFloat(units);
    }

    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      units = new Intl.NumberFormat(navigator.language, {
        notation: "compact",
        compactDisplay: "short",
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(units as number);
    }

    setFormattedUnits(units);
  }, [children, decimals]);

  return <>{formattedUnits}</>;
}
