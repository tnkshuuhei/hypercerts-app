"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { WalletProfile } from "@/components/wallet-profile";
import { siteConfig } from "@/configs/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowUpRight, Menu } from "lucide-react";
import Link from "next/link";

const MobileNav = () => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) return null;

  return (
    <Menubar className="h-14 fixed bottom-4 left-4 right-4 md:hidden backdrop-blur-sm py-3 border-[1.5px] border-slate-300 bg-slate-50/70 justify-between">
      <MenubarMenu>
        <MenubarTrigger
          aria-label="Menu"
          className="focus:bg-slate-200 data-[state=open]:bg-slate-200"
        >
          <Menu size={24} className="mr-1" /> Menu
        </MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href={siteConfig.links.explore}>Explore</Link>
          </MenubarItem>
          <MenubarSub>
            <MenubarSubTrigger>Create</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>
                <Link href={siteConfig.links.createHypercert}>
                  New Hypercert
                </Link>
              </MenubarItem>
              <MenubarItem>
                <Link href={siteConfig.links.createHyperboard}>
                  New Hyperboard
                </Link>
              </MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            <Link
              href={siteConfig.links.docs}
              className="w-full h-full flex justify-between"
            >
              Docs
              <ArrowUpRight size={14} className="opacity-50" />
            </Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <div className="pr-2 py-0 bg-none data-[state=open]:bg-none focus:bg-none">
          <WalletProfile />
        </div>
      </MenubarMenu>
    </Menubar>
  );
};

export { MobileNav as default };
