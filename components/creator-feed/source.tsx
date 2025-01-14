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
interface SourceProps {
  type: string;
  src: string;
  name?: string; // use for file name
}

export default function Source({ type, src, name }: SourceProps) {
  // TODO: implement dialog
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
                  <span className="truncate">{name}</span>
                  <span className="text-gray-500"> {truncateCID(src)}</span>
                </div>
              )}
            </span>
          </div>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            You are about to view external content. Please continue with
            caution.
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="w-1/2">Go back</AlertDialogCancel>
          <Link
            href={type === "url" ? src : `https://${src}.ipfs.w3s.link`}
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
