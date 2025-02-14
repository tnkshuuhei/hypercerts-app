"use client";

import { Button } from "@/components/ui/button";

export function BuyButton({ isListed }: { isListed: boolean }) {
  const handleClick = () => {
    const listingsSection = document.getElementById("marketplace-listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error("Marketplace listings section not found");
    }
  };

  return (
    <Button onClick={handleClick} disabled={!isListed}>
      Buy
    </Button>
  );
}

export default BuyButton;
