import { isString } from "remeda";

export function formatFractionUnits(units: string | number) {
  if (isString(units)) {
    units = Number.parseInt(units, 10);
  }

  return new Intl.NumberFormat(navigator.language, {
    notation: "compact",
    compactDisplay: "short",
  }).format(units);
}
