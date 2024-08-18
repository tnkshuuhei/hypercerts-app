"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";

import { useState } from "react";

export default function ReadMore({
  text,
  length = 280,
}: {
  text: string | null | undefined;
  length?: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (!text) {
    return null;
  }

  if (text.length <= length) {
    return <div>{text}</div>;
  }

  const cutoffText = text.substring(0, length) + "...";

  return (
    <div className="flex flex-col">
      {!isOpen && cutoffText}
      <Collapsible onOpenChange={setIsOpen}>
        <CollapsibleContent className="text-pretty">{text}</CollapsibleContent>
        <CollapsibleTrigger className="text-blue-600 hover:underline text-xs lg:text-sm">
          {isOpen ? "Read less" : "Read more"}
        </CollapsibleTrigger>
      </Collapsible>
    </div>
  );
}
