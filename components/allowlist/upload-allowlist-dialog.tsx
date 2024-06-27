import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Download, LoaderCircle } from "lucide-react";
import { FormControl, FormItem, FormLabel } from "../ui/form";
import { isAddress, parseEther } from "viem";
import { useEffect, useState } from "react";

import { AllowlistEntry } from "@hypercerts-org/sdk";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { errorHasMessage } from "../../lib/errorHasMessage";
import { parse } from "csv-parse/sync";
import { toast } from "../ui/use-toast";
import { useCreateAllowList } from "../../hypercerts/hooks/useCreateAllowLists";

const TOTAL_UNITS = parseEther("1");

export default function UploadAllowlistDialog({
  setAllowlistUrl,
  setOpen,
  open,
}: {
  setAllowlistUrl: (url: string) => void;
  setOpen: (open: boolean) => void;
  open: boolean;
}) {
  const {
    mutate: createAllowList,
    data: createAllowListResponse,
    isPending,
    error: createAllowListError,
    reset,
  } = useCreateAllowList();

  const [allowList, setAllowList] = useState<AllowlistEntry[]>();

  useEffect(() => {
    if (
      createAllowListResponse &&
      (createAllowListResponse.status === 200 ||
        createAllowListResponse.status === 201)
    ) {
      (async () => {
        const res = await createAllowListResponse.json();
        if (
          "success" in res &&
          res.success &&
          "data" in res &&
          "cid" in res.data
        ) {
          const cid = res.data.cid;
          const url = `ipfs://${cid}`;
          setAllowlistUrl(url);
          reset();
          setOpen(false);
        }
      })();
    }
  }, [createAllowListResponse, setAllowlistUrl, setOpen, reset]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowList(undefined);
    const file = e.target.files?.[0];

    try {
      if (!file) {
        throw new Error("No file selected");
      }

      if (file.type !== "text/csv") {
        throw new Error("Select a CSV file");
      }

      const csv = await file.text();
      let parsedCsv = parse(csv, {
        relax_column_count: false,
        relax_quotes: true,
        trim: true,
      });

      let _allowlist: AllowlistEntry[] = [];
      let totalUnits = BigInt(0);
      for (const entry of parsedCsv.slice(1)) {
        const address = entry[0];
        if (!isAddress(address)) {
          throw new Error("Invalid allow list address: " + address);
        }
        const units = BigInt(entry[1]);
        _allowlist.push({
          address,
          units,
        });
        totalUnits += units;
      }

      if (totalUnits > TOTAL_UNITS) {
        throw new Error("Total units exceeds allowlist limit");
      }

      if (totalUnits < TOTAL_UNITS) {
        throw new Error("Total units is less than allowlist limit");
      }

      setAllowList(_allowlist);
    } catch (e) {
      console.error(e);
      if (errorHasMessage(e)) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "CSV upload error",
          variant: "destructive",
        });
      }
    }
  };

  const submitList = async () => {
    try {
      if (!allowList) {
        throw new Error("No allowlist provided");
      }
      createAllowList({ allowList, totalUnits: TOTAL_UNITS });
    } catch (e) {
      if (errorHasMessage(e)) {
        toast({
          title: "Error",
          description: e.message,
          variant: "destructive",
        });
      } else {
        toast({ title: "Error", description: "Failed to upload allow list" });
      }
    }
  };

  const saveButtonDisabled = !allowList || allowList.length === 0;

  const CreateAllowListErrorMessage = () => {
    if (createAllowListError) {
      if (errorHasMessage(createAllowListError)) {
        return (
          <div className="text-red-600 text-sm">
            {createAllowListError.message}
          </div>
        );
      }
      return (
        <div className="text-red-600 text-sm">Couldnt create allow list</div>
      );
    }
    if (createAllowListResponse && createAllowListResponse.status >= 400) {
      return (
        <div className="text-red-600 text-sm">Failed to create allow list</div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-normal">
            Upload allowlist
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <p>
            Upload a CSV file with a list of addresses and the number of units
            they are allowed to mint. Fill out the provided template to get
            started.
          </p>
          <p>
            <a
              href={"/allowlist.csv"}
              title={"allowlist.csv"}
              target="_blank"
              rel="norefferer"
              className="flex items-center group text-blue-600 px-2 py-1 bg-blue-50 hover:bg-blue-100 w-max rounded-lg text-sm font-medium"
            >
              <span>allowlist.csv</span>
              <Download className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
            </a>
          </p>
          <p>
            Hypercerts are minted with a total supply of 1 ether (10^18 units).
            This means the total number of units in the allowlist is need to sum
            to 10^18.
          </p>
        </div>
        <FormItem>
          <FormLabel>Allowlist</FormLabel>
          <FormControl>
            <Input type="file" id="file" onChange={handleFileChange} />
          </FormControl>
        </FormItem>
        <CreateAllowListErrorMessage />
        <div className="flex gap-2 justify-evenly w-full">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="flex-grow">
              Close
            </Button>
          </DialogClose>
          <Button
            className="flex-grow"
            disabled={saveButtonDisabled}
            onClick={submitList}
          >
            {isPending && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
            )}
            {isPending ? "Saving" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
