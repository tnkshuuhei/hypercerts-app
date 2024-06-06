import * as R from "remeda";

export default function FormattedDate({
  seconds,
  ...props
}: {
  seconds: unknown | string | number;
}) {
  if (R.isString(seconds)) {
    seconds = Number.parseInt(seconds);
  }

  if (!R.isNumber(seconds)) {
    return <div>Invalid date</div>;
  }

  const date = new Date(seconds * 1000);

  return (
    <div {...props}>
      {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date)}
    </div>
  );
}
