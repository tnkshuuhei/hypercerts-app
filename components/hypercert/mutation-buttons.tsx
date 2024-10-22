"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import TransferButton from "@/components/hypercert/transfer-button";
import BurnButton from "@/components/hypercert/burn-button";
import { MoreHorizontal } from "lucide-react";
import type { HypercertFull } from "@/hypercerts/fragments/hypercert-full.fragment";

type MutationButtonsProps = {
  hypercert: HypercertFull;
};

export default function MutationButtons({ hypercert }: MutationButtonsProps) {
  return (
    <div className="flex flex-row items-center space-x-2 mt-2">
      <div className="hidden md:block">
        <TransferButton hypercert={hypercert} />
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <TransferButton hypercert={hypercert} />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <BurnButton hypercert={hypercert} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
