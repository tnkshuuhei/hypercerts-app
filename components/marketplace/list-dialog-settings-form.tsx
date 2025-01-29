import { FormattedUnits } from "../formatted-units";
import { Input } from "../ui/input";
import { round } from "remeda";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import { ListingFormValues } from "./list-dialog";

interface ListDialogSettingsFormProps {
  control: Control<ListingFormValues>;
  units: string;
}

export default function ListDialogSettingsForm({
  control,
  units,
}: ListDialogSettingsFormProps) {
  return (
    <div className="border rounded-sm p-5 border-slate-200 flex flex-col gap-5">
      <FormField
        control={control}
        name="unitsForSale"
        render={({ field }) => {
          // calculate percentage of units offered
          const percentage = units
            ? (Number.parseInt(field.value || "0", 10) /
                Number.parseInt(units, 10)) *
              100
            : 0;
          const roundedPercentage = round(percentage, 3);

          return (
            <FormItem className="flex flex-col gap-3">
              <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
                Units offered
              </h5>
              <FormControl>
                <Input
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>
                <FormattedUnits>
                  {field.value
                    ? BigInt(Math.floor(Number(field.value))).toString()
                    : "0"}
                </FormattedUnits>{" "}
                units ({roundedPercentage}% of fraction) will be offered for
                sale.
              </FormDescription>
              <FormMessage />
            </FormItem>
          );
        }}
      />

      <FormField
        control={control}
        name="unitsMinPerOrder"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
              MIN UNITS PER ORDER
            </h5>
            <FormControl>
              <Input
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              Units from this fraction can be purchased for at least{" "}
              <FormattedUnits>
                {field.value
                  ? BigInt(Math.floor(Number(field.value))).toString()
                  : "0"}
              </FormattedUnits>{" "}
              units per order.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="unitsMaxPerOrder"
        render={({ field }) => (
          <FormItem className="flex flex-col gap-3">
            <h5 className="uppercase text-sm text-slate-500 font-medium tracking-wider">
              MAX UNITS PER ORDER
            </h5>
            <FormControl>
              <Input
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    field.onChange(value);
                  }
                }}
              />
            </FormControl>
            <FormDescription>
              from this fraction can be purchased for at most{" "}
              <FormattedUnits>
                {field.value
                  ? BigInt(Math.floor(Number(field.value))).toString()
                  : "0"}
              </FormattedUnits>{" "}
              units per order.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
