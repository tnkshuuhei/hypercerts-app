import { Compass, Book, LucideIcon, PlusCircle } from "lucide-react";

interface SiteConfig {
  name: string;
  origin: string;
  description: string;
  localeDefault: string;
  links: {
    discord: string;
    twitter: string;
    github: string;
  };
  navLinks: {
    title: string;
    path: string;
    type?: "external";
    icon: LucideIcon;
  }[];
}

export const siteConfig: SiteConfig = {
  name: "Hypercerts",
  origin: "https://app.hypercerts.org",
  description:
    "Explore, mint, manage, buy, sell, and evaluate Hypercerts with ease.",
  localeDefault: "en",
  links: {
    discord: "https://discord.gg/uExrjW4h7W",
    twitter: "https://twitter.com/hypercerts",
    github: "https://github.com/hypercerts-org/",
  },
  navLinks: [
    { title: "Explore", path: "/explore", icon: Compass },
    { title: "Create", path: "/create", icon: PlusCircle },
    {
      title: "Docs",
      path: "https://hypercerts.org/docs/",
      type: "external",
      icon: Book,
    },
  ],
};
