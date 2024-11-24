"use client";
import { useSearchParams } from "next/navigation";
import ExploreChainFilterSelect from "@/components/explore/explore-chain-filter-select";
import ExploreEvaluationsFilterSelect from "@/components/explore/explore-evaluations-filter-select";
import ExploreOrderBySelect from "@/components/explore/explore-order-by-select";
import { CurrencyButtons } from "@/components/currency-buttons";
import { useMediaQuery } from "@/hooks/use-media-query";

const ExploreFiltersLayout = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const searchParams = useSearchParams();

  // TODO: Consistent passing or properties to the filters
  // TODO: Generalized filter component for all explore/profile pages
  const FiltersContent = (
    <>
      <ExploreChainFilterSelect value={searchParams.get("chain") || ""} />
      <ExploreEvaluationsFilterSelect
        value={searchParams.get("filter") || ""}
      />
      <ExploreOrderBySelect value={searchParams.get("orderBy") || ""} />
      <CurrencyButtons />
    </>
  );

  return (
    <section
      className="w-full max-w-screen-sm"
      role="region"
      aria-label="Explore filters"
    >
      {isDesktop ? (
        <div className="flex space-x-2">{FiltersContent}</div>
      ) : (
        <div className="space-y-2">
          <div className="flex space-x-2 w-full">
            <ExploreChainFilterSelect value={searchParams.get("chain") || ""} />
            <ExploreEvaluationsFilterSelect
              value={searchParams.get("filter") || ""}
            />
          </div>
          <div className="flex space-x-2 w-full">
            <CurrencyButtons />
            <ExploreOrderBySelect value={searchParams.get("orderBy") || ""} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ExploreFiltersLayout;
