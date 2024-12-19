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
interface SourceProps {
  type: string;
  src: string;
  name?: string; // use for file name
}

export default function Source({ type, src }: SourceProps) {
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
            <span className="truncate flex-1">{src}</span>
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
            href={src}
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
