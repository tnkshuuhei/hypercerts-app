import { useEffect, useRef } from "react";

import { FormattedUnits } from "../formatted-units";
import { Input } from "../ui/input";
import { round } from "remeda";
import { DateTimePicker } from "@/components/ui/datetime-picker";

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
  startDateTime,
  setStartDateTime,
  endDateTime,
  setEndDateTime,
}: {
  selectedFractionUnits?: string;
  unitsForSale?: string;
  unitsMinPerOrder?: string;
  unitsMaxPerOrder?: string;
  setUnitsForSale: (unitsForSale: string) => void;
  setUnitsMinPerOrder: (unitsMinPerOrder: string) => void;
  setUnitsMaxPerOrder: (unitsMaxPerOrder: string) => void;
  setFormIsValid: (formIsValid: boolean) => void;
  startDateTime?: Date;
  setStartDateTime?: (startDateTime?: Date) => void;
  endDateTime?: Date;
  setEndDateTime?: (endDateTime?: Date) => void;
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

    console.log(_unitsForSale, _selectedFractionUnits);
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

  const validateStartDateTime = (): [boolean, React.ReactNode] => {
    if (!startDateTime) {
      return [false, "Must be a valid date and time."];
    }

    if (startDateTime <= new Date()) {
      return [false, "Must be in the future."];
    }

    return [true, "Sale will start at the selected moment."];
  };

  const validateEndDateTime = (): [boolean, React.ReactNode] => {
    if (!endDateTime) {
      return [false, "Must be a valid date and time."];
    }

    if (endDateTime <= new Date()) {
      return [false, "Must be in the future."];
    }

    if (startDateTime && endDateTime <= startDateTime) {
      return [false, "Must be after the start of the sale."];
    }

    return [true, "Sale will end at the selected moment."];
  };

  const unitsForSaleValidation = validateUnitsForSale();
  const unitsMinPerOrderValidation = validateUnitsMinPerOrder();
  const unitsMaxPerOrderValidation = validateUnitsMaxPerOrder();
  const startDateTimeValidation = validateStartDateTime();
  const endDateTimeValidation = validateEndDateTime();

  const formIsValid =
    unitsForSaleValidation[0] &&
    unitsMinPerOrderValidation[0] &&
    unitsMaxPerOrderValidation[0] &&
    startDateTimeValidation[0] &&
    endDateTimeValidation[0];

  const formIsValidRef = useRef(formIsValid);
  useEffect(() => {
    const _formIsValid = formIsValidRef.current;
    if (formIsValid !== _formIsValid) {
      formIsValidRef.current = formIsValid;
      setFormIsValid(formIsValid);
    }
  }, [formIsValid, setFormIsValid]);

  return (
    <div className="border rounded-sm p-5 border-gray-200 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-gray-500 font-medium tracking-wider">
          Units offered
        </h5>
        <Input
          type="text"
          value={unitsForSale}
          onChange={(e) => setUnitsForSale(e.target.value)}
        />
        {unitsForSaleValidation[0] ? (
          <div className="text-sm text-gray-500">
            {unitsForSaleValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsForSaleValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-gray-500 font-medium tracking-wider">
          MIN UNITS PER ORDER
        </h5>
        <Input
          type="text"
          value={unitsMinPerOrder}
          onChange={(e) => setUnitsMinPerOrder(e.target.value)}
        />
        {unitsMinPerOrderValidation[0] ? (
          <div className="text-sm text-gray-500">
            {unitsMinPerOrderValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsMinPerOrderValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-gray-500 font-medium tracking-wider">
          MAX UNITS PER ORDER
        </h5>
        <Input
          type="text"
          value={unitsMaxPerOrder}
          onChange={(e) => setUnitsMaxPerOrder(e.target.value)}
        />
        {unitsMaxPerOrderValidation[0] ? (
          <div className="text-sm text-gray-500">
            {unitsMaxPerOrderValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {unitsMaxPerOrderValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-gray-500 font-medium tracking-wider">
          SALE STARTING TIME
        </h5>
        <DateTimePicker onChange={setStartDateTime} value={startDateTime} />
        {startDateTimeValidation[0] ? (
          <div className="text-sm text-gray-500">
            {startDateTimeValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">
            {startDateTimeValidation[1]}
          </div>
        )}{" "}
      </div>

      <div className="flex flex-col gap-3">
        <h5 className="uppercase text-sm text-gray-500 font-medium tracking-wider">
          SALE ENDING TIME
        </h5>
        <DateTimePicker onChange={setEndDateTime} value={endDateTime} />
        {endDateTimeValidation[0] ? (
          <div className="text-sm text-gray-500">
            {endDateTimeValidation[1]}
          </div>
        ) : (
          <div className="text-sm text-red-500">{endDateTimeValidation[1]}</div>
        )}{" "}
      </div>
    </div>
  );
}
