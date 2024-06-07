import { HYPERCERTS_PER_PAGE } from "../../configs/ui";
import PaginationButton from "./pagination-button";
import { getHypercertsTotal } from "../../hypercerts/getHypercertsTotal";

export default async function Pagination({
  searchParams,
  hypercertsCount,
}: {
  searchParams: Record<string, string>;
  hypercertsCount: number;
}) {
  const totalPages = Math.ceil((hypercertsCount || 0) / HYPERCERTS_PER_PAGE);
  const currentPage = Number(searchParams?.p) || 1;

  const urlSearchParams = new URLSearchParams(searchParams);
  const navQs = (toPage: number) => {
    urlSearchParams.set("p", toPage.toString());
    return urlSearchParams.toString();
  };

  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center justify-start gap-2 w-[250px]">
        {currentPage > 1 && (
          <PaginationButton arrow="left" qs={navQs(1)}>
            First
          </PaginationButton>
        )}

        {currentPage > 1 && (
          <PaginationButton arrow="left" qs={navQs(currentPage - 1)}>
            Previous
          </PaginationButton>
        )}
      </div>

      <div className="pt-1 text-sm text-gray-500 whitespace-nowrap">
        {currentPage} of {totalPages}
      </div>

      <div className="flex items-center justify-end gap-2 w-[250px]">
        {currentPage < totalPages && (
          <PaginationButton arrow="right" qs={navQs(currentPage + 1)}>
            Next
          </PaginationButton>
        )}

        {currentPage < totalPages && (
          <PaginationButton arrow="right" qs={navQs(totalPages)}>
            Last
          </PaginationButton>
        )}
      </div>
    </div>
  );
}
