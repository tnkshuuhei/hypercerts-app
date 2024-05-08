"use client";
import { siteConfig } from "@/configs/site";
import { buttonVariants } from "@/components/ui/button";
import {
  ArrowUpRight,
  Book,
  ChevronDown,
  Menu,
  MenuIcon,
  Sparkle,
} from "lucide-react";
import Link from "next/link";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { usePathname } from "next/navigation";
import ConnectDialog from "@/components/connect-dialog";
import { createElement, useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
        className={`${buttonVariants({
          variant: "link",
          size: "sm",
        })} text-sm p-0 ${
          currentPath === "/explore"
            ? "opacity-1 font-semibold hover:opacity-100"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        <span className="hover:underline">Explore</span>
      </Link>
      <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      <DropdownMenu>
        <DropdownMenuTrigger
          className={buttonVariants({ variant: "outline", size: "sm" })}
        >
          <span>
            <Menu size={18} />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[156px]">
          <DropdownMenuItem>
            <a
              href={siteConfig.links.docs}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonVariants({
                variant: "link",
                size: "sm",
              })} w-full group text-sm duration-300 font-medium ease-out opacity-70 hover:opacity-100} justify-between`}
            >
              <span>
                <Book size={16} className="mr-1" />
              </span>
              <span>Docs</span>
              <ArrowUpRight
                size={18}
                className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
                aria-hidden="true"
              />
            </a>
          </DropdownMenuItem>

          <Accordion type="single" collapsible className="border-b-0">
            <AccordionItem value="create">
              <AccordionTrigger
                className={`${buttonVariants({
                  variant: "link",
                })} justify-between`}
              >
                <span>
                  <Sparkle size={16} className="mr-1" />
                </span>
                Create
              </AccordionTrigger>
              <AccordionContent className="pb-0 border-b-0">
                <ul>
                  <li className="w-full bg-slate-50">
                    <Link
                      href="/create/hypercert"
                      className={`${buttonVariants({
                        variant: "link",
                      })} text-sm ${
                        currentPath === "/create/hypercert"
                          ? "opacity-1 font-semibold hover:opacity-100"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      New Hypercert
                    </Link>
                  </li>
                  <li className="w-full bg-slate-50">
                    <Link
                      href="/create/hyperboard"
                      className={`${buttonVariants({
                        variant: "link",
                      })} text-sm ${
                        currentPath === "/create/hyperboard"
                          ? "opacity-1 font-semibold hover:opacity-100"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    >
                      New Hyperboard
                    </Link>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export { MobileNav as default };
