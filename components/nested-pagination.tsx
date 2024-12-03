"use client";

import { useCallback } from "react";
import PaginationButton from "./pagination-button";

interface PaginationProps {
  searchParams: Record<string, string>;
  totalItems: number;
  itemsPerPage: number;
  basePath?: string;
  parameterName?: string;
  currentPage?: number;
}

export default function NestedPagination({
  searchParams,
  totalItems,
  itemsPerPage,
  basePath = "",
  parameterName = "p",
  currentPage,
}: PaginationProps) {
  const totalPages = Math.ceil((totalItems || 0) / itemsPerPage);
  const pageNumber = currentPage || Number(searchParams[parameterName]) || 1;

  const getPageHref = useCallback(
    (page: number) => {
      const urlSearchParams = new URLSearchParams(searchParams);
      urlSearchParams.set(parameterName, page.toString());
      return `${basePath}?${urlSearchParams.toString()}`;
    },
    [searchParams, basePath, parameterName],
  );

  if (pageNumber > totalPages) {
    return null;
  }

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

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between w-full mt-4">
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
