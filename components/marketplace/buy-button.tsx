"use client";

import { Button } from "@/components/ui/button";

export function BuyButton() {
  const handleClick = () => {
    const listingsSection = document.getElementById("marketplace-listings");
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return <Button onClick={handleClick}>Buy</Button>;
}
