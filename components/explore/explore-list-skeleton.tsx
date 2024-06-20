import PaginationSkeleton from "@/components/pagination-skeleton";

export default function ExploreListSkeleton({ length }: { length: number }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-5">
        {Array.from({ length }, (_, i) => (
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
