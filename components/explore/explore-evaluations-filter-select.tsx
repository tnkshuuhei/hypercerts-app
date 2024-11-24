import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useRouter, useSearchParams } from "next/navigation";

interface ExploreEvaluationsFilterSelectProps {
  value: string;
}

export default function ExploreEvaluationsFilterSelect({
  value,
}: ExploreEvaluationsFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const selectedValue = value || "all";

  const handleChange = (newValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (newValue === "all") {
      params.delete("filter");
    } else {
      params.set("filter", newValue);
    }
    params.set("p", "1"); // Reset page when changing filter
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={value || "all"} onValueChange={handleChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="All Hypercerts" />
      </SelectTrigger>
      <SelectContent className="w-full">
        <SelectItem value="all">All Hypercerts</SelectItem>
        <SelectItem value="evaluated">Only evaluated</SelectItem>
      </SelectContent>
    </Select>
  );
}
