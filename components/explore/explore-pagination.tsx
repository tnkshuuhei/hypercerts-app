"use client";

import { HYPERCERTS_PER_PAGE } from "@/configs/ui";
import PaginationButton from "../pagination-button";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

interface ExplorePaginationProps {
  searchParams: Record<string, string>;
  hypercertsCount: number;
}

export default function ExplorePagination({
  searchParams,
  hypercertsCount,
}: ExplorePaginationProps) {
  const router = useRouter();
  const totalPages = Math.ceil((hypercertsCount || 0) / HYPERCERTS_PER_PAGE);
  const currentPage = Number(searchParams?.p) || 1;

  const getPageHref = useCallback(
    (page: number) => {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.set("p", page.toString());
      return `/explore?${urlSearchParams.toString()}`;
    },
    [searchParams],
  );

  const navigateToPage = useCallback(
    (page: number) => {
      router.push(getPageHref(page));
    },
    [router, getPageHref],
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <PaginationButton
          key={i}
          href={getPageHref(i)}
          active={i === currentPage}
        >
          {i}
        </PaginationButton>,
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full">
      <div className="flex items-center justify-start gap-2">
        {currentPage > 1 && (
          <>
            <PaginationButton href={getPageHref(1)} arrow="left">
              First
            </PaginationButton>
            <PaginationButton href={getPageHref(currentPage - 1)} arrow="left">
              Previous
            </PaginationButton>
          </>
        )}
      </div>

      <div className="flex items-center justify-center gap-2">
        {renderPageNumbers()}
      </div>

      <div className="flex items-center justify-end gap-2">
        {currentPage < totalPages && (
          <>
            <PaginationButton href={getPageHref(currentPage + 1)} arrow="right">
              Next
            </PaginationButton>
            <PaginationButton href={getPageHref(totalPages)} arrow="right">
              Last
            </PaginationButton>
          </>
        )}
      </div>
    </div>
  );
}
