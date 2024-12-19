import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight, File, LinkIcon } from "lucide-react";

interface SourceProps {
  type: string;
  src: string;
  name?: string; // use for file name
}

export default function Source({ type, src }: SourceProps) {
  // TODO: implement dialog
  return (
    <Button variant={"link"} className="cursor-pointer text-sm p-0">
      <div className="flex flex-row items-center">
        {type === "url" ? (
          <LinkIcon className="h-4 w-4 mr-2" />
        ) : (
          <File className="h-4 w-4 mr-2" />
        )}
        <span className="truncate flex-1">{src}</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </Button>
  );
}
