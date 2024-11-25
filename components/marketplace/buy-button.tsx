"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BuyButton() {
  const router = useRouter();

  const handleClick = () => {
    // Smooth scroll to the listings section
    const listingsSection = document.getElementById("marketplace-listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <Button onClick={handleClick}>Buy</Button>;
}
