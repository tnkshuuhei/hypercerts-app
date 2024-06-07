import { HYPERCERTS_PER_PAGE } from "../../configs/ui";
import PaginationSkeleton from "./pagination-skeleton";

export default function HypercertsListSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: HYPERCERTS_PER_PAGE }, (_, i) => (
          <div
            key={i}
            className="w-[275px] h-[300px] bg-slate-100 rounded-lg"
          />
        ))}
      </div>
      <PaginationSkeleton />
    </div>
  );
}
