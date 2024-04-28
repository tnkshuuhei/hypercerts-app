"use client";
import { siteConfig } from "@/configs/site";
import { buttonVariants } from "@/components/ui/button";
import { ArrowUpRight, Menu, MenuIcon } from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import ConnectDialog from "@/components/connect-dialog";
import { createElement, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@radix-ui/react-popover";

const MobileNav = () => {
  const currentPath = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const hiddenLinks = siteConfig.navLinks.filter(
    (link) => link.title !== "Explore"
  );

  if (isDesktop) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 bg-slate-100/70 md:hidden border-[1.5px] p-3 flex items-center justify-between rounded-xl backdrop-blur-sm">
      <Link
        href={"/explore"}
        className={`${buttonVariants({ variant: "link" })} text-sm p-0 ${
          currentPath === "/explore"
            ? "opacity-1 font-semibold hover:opacity-100"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        <span className="hover:underline">Explore</span>
      </Link>
      <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <Popover>
        <PopoverTrigger
          className={buttonVariants({ variant: "outline", size: "sm" })}
          asChild
        >
          <span>
            <Menu size={18} />
          </span>
        </PopoverTrigger>
        <PopoverContent align="end">
          <div className="flex flex-col bg-white border-[1.5px] border-slate-100 rounded-xl items-start shadow-sm">
            {hiddenLinks.map((link) =>
              link.type === "external" ? (
                <a
                  href={link.path}
                  key={link.title}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${buttonVariants({
                    variant: "link",
                  })} group text-sm duration-300 ease-out opacity-70 hover:opacity-100}`}
                >
                  <span>
                    {createElement(link.icon, { size: 16, className: "mr-1" })}
                  </span>
                  <span>{link.title}</span>
                  <ArrowUpRight
                    size={18}
                    className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
                    aria-hidden="true"
                  />
                </a>
              ) : (
                <Link
                  key={link.title}
                  href={link.path}
                  className={`${buttonVariants({ variant: "link" })} text-sm ${
                    currentPath === link.path
                      ? "opacity-1 font-semibold hover:opacity-100"
                      : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <span>
                    {createElement(link.icon, { size: 16, className: "mr-1" })}
                  </span>
                  <span className="hover:underline">{link.title}</span>
                </Link>
              )
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { MobileNav as default };
