import { useEffect, useRef } from "react";

import { FormattedUnits } from "../formatted-units";
import { Input } from "../ui/input";
import { round } from "remeda";

export type ListSettingsFormRef = {
  formIsValid: boolean;
};

export default function ListDialogSettingsForm({
  selectedFractionUnits,
  unitsForSale,
  unitsMinPerOrder,
  unitsMaxPerOrder,
  setUnitsForSale,
  setUnitsMinPerOrder,
  setUnitsMaxPerOrder,
  setFormIsValid,
}: {
  selectedFractionUnits?: string;
  unitsForSale?: string;
  unitsMinPerOrder?: string;
  unitsMaxPerOrder?: string;
  setUnitsForSale: (unitsForSale: string) => void;
  setUnitsMinPerOrder: (unitsMinPerOrder: string) => void;
  setUnitsMaxPerOrder: (unitsMaxPerOrder: string) => void;
  setFormIsValid: (formIsValid: boolean) => void;
}) {
  const _selectedFractionUnits = BigInt(selectedFractionUnits || "0");
  const _unitsForSale = BigInt(unitsForSale || "0");
  const _unitsMinPerOrder = BigInt(unitsMinPerOrder || "0");
  const _unitsMaxPerOrder = BigInt(unitsMaxPerOrder || "0");

  const validateUnitsForSale = (): [boolean, React.ReactNode] => {
    if (_unitsForSale === BigInt(0)) {
      return [false, "Must be more than 0."];
    }

    if (_unitsForSale % BigInt(1) !== BigInt(0)) {
      return [false, "Must be an integer."];
    }

    if (_unitsForSale <= 0) {
      return [false, "Must be more than 0."];
    }

    if (_unitsForSale > _selectedFractionUnits) {
      return [false, "Must be no more than the fraction's total units."];
    }

    let unitsForSalePercentageOfFraction =
      (Number.parseInt(unitsForSale || "0", 10) /
        Number.parseInt(selectedFractionUnits || "0", 10)) *
      100;
    unitsForSalePercentageOfFraction = round(
      unitsForSalePercentageOfFraction,
      3,
    );

    return [
      true,
      <>
        <FormattedUnits>{_unitsForSale.toString()}</FormattedUnits> units (
        {unitsForSalePercentageOfFraction}% of fraction) will be offered for
        sale.
      </>,
    ];
  };

  const validateUnitsMinPerOrder = (): [boolean, React.ReactNode] => {
    if (_unitsMinPerOrder === BigInt(0)) {
      return [false, "Must be more than 0."];
    }

    if (_unitsMinPerOrder % BigInt(1) !== BigInt(0)) {
      return [false, "Must be an integer."];
    }

    if (_unitsMinPerOrder <= 0) {
      return [false, "Must be more than 0."];
    }

    if (_unitsMinPerOrder > _unitsForSale) {
      return [false, "Must be no more than the units for sale."];
    }

    if (_unitsForSale % _unitsMinPerOrder !== BigInt(0)) {
      return [false, "Must divide evenly into the units for sale."];
    }

    return [
      true,
      <>
        Units from this fraction can be purchased for at least{" "}
        <FormattedUnits>{_unitsMinPerOrder.toString()}</FormattedUnits> units
        per order.
      </>,
    ];
  };

  const validateUnitsMaxPerOrder = (): [boolean, React.ReactNode] => {
    if (!_unitsMaxPerOrder) {
      return [false, "Must be more than 0."];
    }

    if (!_unitsMinPerOrder) {
      return [false, "Min units must be more than 0."];
    }

    if (_unitsMaxPerOrder === BigInt(0)) {
      return [false, "Must be more than 0."];
    }

    if (_unitsMaxPerOrder % BigInt(1) !== BigInt(0)) {
      return [false, "Must be an integer."];
    }

    if (_unitsMaxPerOrder <= 0) {
      return [false, "Must be more than 0."];
    }

    if (_unitsMaxPerOrder > _unitsForSale) {
      return [false, "Must be no more than the units for sale."];
    }

    if (_unitsForSale % _unitsMaxPerOrder !== BigInt(0)) {
      return [false, "Must divide evenly into the units for sale."];
    }

    if (_unitsMaxPerOrder < _unitsMinPerOrder) {
      return [false, "Must be at least the minimum units per order."];
    }

    if (_unitsMaxPerOrder % _unitsMinPerOrder !== BigInt(0)) {
      return [false, "Must be a multiple of the minimum units per order."];
    }

    return [
      true,
      <>
        Units from this fraction can be purchased for at most{" "}
        <FormattedUnits>{_unitsMaxPerOrder.toString()}</FormattedUnits> units
        per order.
      </>,
    ];
  };

  const unitsForSaleValidation = validateUnitsForSale();
  const unitsMinPerOrderValidation = validateUnitsMinPerOrder();
  const unitsMaxPerOrderValidation = validateUnitsMaxPerOrder();

  const formIsValid =
    unitsForSaleValidation[0] &&
    unitsMinPerOrderValidation[0] &&
    unitsMaxPerOrderValidation[0];

  const formIsValidRef = useRef(formIsValid);
  useEffect(() => {
    const _formIsValid = formIsValidRef.current;
    if (formIsValid !== _formIsValid) {
      formIsValidRef.current = formIsValid;
      setFormIsValid(formIsValid);
    }
  }, [formIsValid, setFormIsValid]);

  return (
    <div className="border rounded-sm p-5 border-slate-200 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          Units offered
        </h5>
        <Input
          type="text"
          value={unitsForSale}
          onChange={(e) => setUnitsForSale(e.target.value)}
        />
        {unitsForSaleValidation[0] ? (
          <div className="text-sm text-slate-500">
            {unitsForSaleValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsForSaleValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          MIN UNITS PER ORDER
        </h5>
        <Input
          type="text"
          value={unitsMinPerOrder}
          onChange={(e) => setUnitsMinPerOrder(e.target.value)}
        />
        {unitsMinPerOrderValidation[0] ? (
          <div className="text-sm text-slate-500">
            {unitsMinPerOrderValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsMinPerOrderValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
          MAX UNITS PER ORDER
        </h5>
        <Input
          type="text"
          value={unitsMaxPerOrder}
          onChange={(e) => setUnitsMaxPerOrder(e.target.value)}
        />
        {unitsMaxPerOrderValidation[0] ? (
          <div className="text-sm text-slate-500">
            {unitsMaxPerOrderValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsMaxPerOrderValidation[1]}
          </div>
        )}{" "}
      </div>
    </div>
  );
}
