"use client";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { siteConfig } from "@/configs/site";
import { useMediaQuery } from "@/hooks/use-media-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const MobileNav = () => {
  const currentPath = usePathname();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) return null;

  return (
    // <div className="fixed bottom-4 left-4 right-4 bg-slate-100/70 md:hidden border-[1.5px] p-3 flex items-center justify-between rounded-xl backdrop-blur-sm">
    //   <Link
    //     href={siteConfig.links.explore}
    //     className={`${buttonVariants({
    //       variant: "link",
    //       size: "sm",
    //     })} text-sm p-0 ${
    //       currentPath === siteConfig.links.explore
    //         ? "opacity-1 font-semibold hover:opacity-100"
    //         : "opacity-70 hover:opacity-100"
    //     }`}
    //   >
    //     <span className="hover:underline">Explore</span>
    //   </Link>
    //   <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    //   <DropdownMenu>
    //     <DropdownMenuTrigger
    //       className={buttonVariants({ variant: "outline", size: "sm" })}
    //     >
    //       <span>
    //         <Menu size={18} />
    //       </span>
    //     </DropdownMenuTrigger>
    //     <DropdownMenuContent align="end" className="w-[156px]">
    //       <DropdownMenuItem>
    //         <a
    //           href={siteConfig.links.docs}
    //           target="_blank"
    //           rel="noopener noreferrer"
    //           className={`${buttonVariants({
    //             variant: "link",
    //             size: "sm",
    //           })} w-full group text-sm duration-300 font-medium ease-out opacity-70 hover:opacity-100} justify-between`}
    //         >
    //           <span>
    //             <Book size={16} className="mr-1" />
    //           </span>
    //           <span>Docs</span>
    //           <ArrowUpRight
    //             size={18}
    //             className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
    //             aria-hidden="true"
    //           />
    //         </a>
    //       </DropdownMenuItem>

    //       <Accordion type="single" collapsible className="border-b-0">
    //         <AccordionItem value="create">
    //           <AccordionTrigger
    //             className={`${buttonVariants({
    //               variant: "link",
    //             })} justify-between`}
    //           >
    //             <span>
    //               <Sparkle size={16} className="mr-1" />
    //             </span>
    //             Create
    //           </AccordionTrigger>
    //           <AccordionContent className="pb-0 border-b-0">
    //             <ul>
    //               <li className="w-full bg-slate-50">
    //                 <Link
    //                   href={siteConfig.links.createHypercert}
    //                   className={`${buttonVariants({
    //                     variant: "link",
    //                   })} text-sm ${
    //                     currentPath === siteConfig.links.createHypercert
    //                       ? "opacity-1 font-semibold hover:opacity-100"
    //                       : "opacity-70 hover:opacity-100"
    //                   }`}
    //                 >
    //                   New Hypercert
    //                 </Link>
    //               </li>
    //               <li className="w-full bg-slate-50">
    //                 <Link
    //                   href={siteConfig.links.createHyperboard}
    //                   className={`${buttonVariants({
    //                     variant: "link",
    //                   })} text-sm ${
    //                     currentPath === siteConfig.links.createHyperboard
    //                       ? "opacity-1 font-semibold hover:opacity-100"
    //                       : "opacity-70 hover:opacity-100"
    //                   }`}
    //                 >
    //                   New Hyperboard
    //                 </Link>
    //               </li>
    //             </ul>
    //           </AccordionContent>
    //         </AccordionItem>
    //       </Accordion>
    //     </DropdownMenuContent>
    //   </DropdownMenu>
    // </div>

    <Menubar className="fixed bottom-4 left-4 right-4 md:hidden backdrop-blur-sm py-3 border-[1.5px] border-slate-300 bg-slate-200/70">
      <MenubarMenu>
        <MenubarTrigger>Create</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>
            <Link href={siteConfig.links.createHypercert}>New Hypercert</Link>
          </MenubarItem>
          <MenubarItem>
            <Link href={siteConfig.links.createHyperboard}>New Hyperboard</Link>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href={siteConfig.links.explore}>Explore</Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <a
            href={siteConfig.links.docs}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex justify-between items-center"
            // className={`${buttonVariants({
            //   variant: "link",
            //   size: "sm",
            // })} w-full group text-sm duration-300 font-medium ease-out opacity-70 hover:opacity-100 justify-between`}
          >
            <span>Docs</span>
            <ArrowUpRight
              size={14}
              className="ml-1 opacity-70 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-transform duration-300 ease-in-out"
              aria-hidden="true"
            />
          </a>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profile</MenubarTrigger>
        <MenubarContent>
          <MenubarRadioGroup value="benoit">
            <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
            <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
            <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
          </MenubarRadioGroup>
          <MenubarSeparator />
          <MenubarItem inset>Edit...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Add Profile...</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
};

export { MobileNav as default };
