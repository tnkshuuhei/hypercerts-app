import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "../ui/button";
import Link from "next/link";

export default function PaginationButton({
  qs,
  arrow,
  children,
}: {
  qs: string;
  arrow: "left" | "right";
  children: string;
}) {
  return (
    <Link href={`/?${qs}`} prefetch={true}>
      <Button aria-label={children} className="flex items-center gap-2">
        {arrow === "left" && (
          <ChevronLeft style={{ width: "10px", height: "10px" }} />
        )}
        {children}
        {arrow === "right" && (
          <ChevronRight style={{ width: "10px", height: "10px" }} />
        )}
      </Button>
    </Link>
  );
}
