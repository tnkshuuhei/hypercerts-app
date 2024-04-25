"use client";

import ConnectDialog from "@/components/connect-dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState } from "react";

// export const metadata = {
//   title: "Explore",
// };

export default function Explore() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <p className="text-gray-500 uppercase text-center text-sm tracking-wide">
          Explore
        </p>
        <h1 className="font-serif text-5xl lg:text-8xl tracking-tight text-center">
          Hypercerts
        </h1>
        <Link href={"/hypercerts/new"}>
          <Button variant="default">New Hypercert</Button>
        </Link>
        <ConnectDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </main>
  );
}
