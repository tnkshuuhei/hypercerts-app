import React from "react";
import { Button } from "../ui/button";
import { ArrowUpRight, File, LinkIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import { truncateCID } from "@/lib/utils";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
interface SourceProps {
  type: string;
  src: string;
  fileName?: string;
}

export default function Source({ type, src, fileName }: SourceProps) {
  const displayUrl = type === "url" ? src : `https://${src}.ipfs.w3s.link`;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"link"} className="cursor-pointer text-sm p-0">
          <div className="flex flex-row items-center">
            {type === "url" ? (
              <LinkIcon className="h-4 w-4 mr-2" />
            ) : (
              <File className="h-4 w-4 mr-2" />
            )}
            <span className="truncate flex-1">
              {type === "url" ? (
                src
              ) : (
                <div className="flex flex-row items-center gap-1">
                  <span className="truncate">{fileName}</span>
                  <span className="text-gray-500"> {truncateCID(src)}</span>
                </div>
              )}
            </span>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-xl md:max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold">
            You are about to view external content. Please continue with
            caution.
          </AlertDialogTitle>
          <AlertDialogDescription className="break-all text-sm">
            {displayUrl}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row items-center gap-2">
          <AlertDialogCancel className="w-1/2 mt-0">Go back</AlertDialogCancel>
          <Link
            href={displayUrl}
            className="w-1/2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AlertDialogAction className="w-full">
              Open link
              <ArrowUpRight className="h-4 w-4 mx-2" />
            </AlertDialogAction>
          </Link>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
