"use client";
import { useState } from "react";
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
import { Drawer } from "vaul";
import { TransferDrawer } from "@/components/hypercert/transfer-drawer";
import { BurnDrawer } from "@/components/hypercert/burn-drawer";

type MutationButtonsProps = {
  hypercert: HypercertFull;
};

export default function MutationButtons({ hypercert }: MutationButtonsProps) {
  const [isTransferDrawerOpen, setIsTransferDrawerOpen] = useState(false);
  const [isBurnDrawerOpen, setIsBurnDrawerOpen] = useState(false);

  const handleTransferClick = () => {
    setIsTransferDrawerOpen(true);
  };

  const handleBurnClick = () => {
    setIsBurnDrawerOpen(true);
  };

  return (
    <div className="flex flex-row items-center space-x-2 mt-2">
      <div className="hidden md:block">
        <Drawer.Root
          open={isTransferDrawerOpen}
          onOpenChange={setIsTransferDrawerOpen}
        >
          <Drawer.Trigger asChild>
            <TransferButton
              hypercert={hypercert}
              onClick={handleTransferClick}
            />
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40" />
            <Drawer.Content className="bg-white flex flex-col rounded-t-[10px] h-full w-[500px] mt-24 fixed bottom-0 right-0">
              <div className="p-4 bg-white flex-1 h-full max-w-md mx-auto flex flex-col gap-5">
                <TransferDrawer hypercert={hypercert} />
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="ghost">
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={handleTransferClick}>
            Transfer
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={handleBurnClick}>Burn</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Drawer.Root
        open={isTransferDrawerOpen}
        onOpenChange={setIsTransferDrawerOpen}
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col h-full w-[500px] mt-24 fixed bottom-0 right-0">
            <div className="p-4 bg-white flex-1 h-full max-w-md mx-auto flex flex-col gap-5">
              <TransferDrawer hypercert={hypercert} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <Drawer.Root open={isBurnDrawerOpen} onOpenChange={setIsBurnDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content className="bg-white flex flex-col h-full w-[500px] mt-24 fixed bottom-0 right-0">
            <div className="p-4 bg-white flex-1 h-full max-w-md mx-auto flex flex-col gap-5">
              <BurnDrawer hypercert={hypercert} />
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
}
