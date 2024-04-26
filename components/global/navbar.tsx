"use client";
import Link from "next/link";
import ConnectDialog from "@/components/connect-dialog";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { buttonVariants } from "../ui/button";
import { usePathname } from "next/navigation";
import { siteConfig } from "@/configs/site";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const currentPath = usePathname();

  return (
    <nav className="flex items-center justify-between p-4">
      <div className="flex items-center space-x-4">
        <Link href="/">
          <span className="font-bold tex-base md:text-xl tracking-tight">
            Hypercerts
          </span>
        </Link>
        <div className="hidden md:flex items-center space-x-2">
          {siteConfig.navLinks.map((link) =>
            link.type === "external" ? (
              <a
                href={link.path}
                key={link.title}
                target="_blank"
                rel="noopener noreferrer"
                className={`${buttonVariants({
                  variant: "link",
                })} group text-lg duration-300 ease-out opacity-70 hover:opacity-100}`}
              >
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
                className={`${buttonVariants({ variant: "link" })} text-lg ${
                  currentPath === link.path
                    ? "opacity-1 font-semibold hover:opacity-100"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <span className="hover:underline">{link.title}</span>
              </Link>
            )
          )}
        </div>
      </div>
      <div className="hidden md:flex items-center space-x-4">
        <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </nav>
  );
};

export { Navbar as default };
