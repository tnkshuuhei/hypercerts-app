import { ChangeEvent, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircle, MinusCircle, PlusCircle } from "lucide-react";
import { isAddress, parseEther } from "viem";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn } from "../../lib/utils";
import { errorHasMessage } from "../../lib/errorHasMessage";
import { toast } from "../ui/use-toast";
import { useCreateAllowList } from "../../hypercerts/hooks/useCreateAllowLists";

type AllowListItem = {
  address?: string;
  percentage?: string;
};

export default function AllowlistDialog() {
  const {
    mutate: createAllowList,
    data: createAllowListResponse,
    isPending,
    error: createAllowListError,
  } = useCreateAllowList();
  const [allowList, setAllowList] = useState<AllowListItem[]>([
    {
      address: undefined,
      percentage: undefined,
    },
  ]);

  const setAddress = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    setAllowList((allowList) =>
      allowList.map((item, index) =>
        index === i
          ? {
              ...item,
              address: e.target.value,
            }
          : item
      )
    );
  };

  const setPercentage = (e: ChangeEvent<HTMLInputElement>, i: number) => {
    setAllowList((allowList) =>
      allowList.map((item, index) =>
        index === i
          ? {
              ...item,
              percentage: e.target.value,
            }
          : item
      )
    );
  };

  const isPercentageValid = (unit: string) => {
    const f = Number.parseFloat(unit);
    return !isNaN(f) && f >= 0 && f <= 100;
  };

  const removeItem = (i: number) => {
    if (allowList.length === 1) {
      return;
    }
    setAllowList((allowList) => allowList.filter((item, index) => index !== i));
  };

  const percentageSum = allowList.reduce(
    (acc, item) => acc + Number.parseFloat(item.percentage || ""),
    0
  );

  const allAddressesValid = allowList.every(
    (item) => item.address && isAddress(item.address)
  );

  const submitList = async () => {
    console.log("Submitting allow list");
    const totalUnits = parseEther("1");
    try {
      const parsedAllowList = allowList.map((entry) => {
        if (
          !entry.address ||
          !isAddress(entry.address) ||
          !entry.percentage ||
          !isPercentageValid(entry.percentage)
        ) {
          throw new Error("Invalid allow list entry");
        }
        return {
          address: entry.address,
          units:
            (BigInt(parseFloat(entry.percentage)) * totalUnits) / BigInt(100),
        };
      });
      if (!parsedAllowList) {
        throw new Error("Allow list is empty");
      }
      createAllowList({ allowList: parsedAllowList, totalUnits });
      console.log("Submitted allow list");
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

  const percentageError =
    percentageSum !== 100 &&
    allowList[0].percentage !== "" &&
    allowList[0].percentage !== undefined;

  const createButtonDisabled =
    allowList.length === 0 || percentageSum !== 100 || !allAddressesValid;

  console.log(createAllowListResponse);
  console.log(createAllowListError);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl font-normal">
            Create allowlist
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col px-2 pt-3">
          Allow lists determine the number of units each address is allowed to
          mint. The allow list is a list of addresses and the number of units
          they are allowed to mint. When you submit the form, the application
          will execute additional validations before uploading the allow list to
          IPFS. When successful the allow list will be available at the CID
          displayed. Hypercerts will be minted with a total supply of 1 ether
          (10 ^ 18 units). The percentages provided in the form below will be
          used to calculate the number of units each address is allowed to mint.
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <div className="flex-grow"></div>
            <div className="w-20 text-center">%</div>
            <div className="w-12"></div>
          </div>
          {allowList.map((item, i) => (
            <div key={i}>
              <div className="flex items-center gap-2">
                <Input
                  type="text"
                  placeholder="0x123"
                  value={item.address}
                  className={cn(
                    "flex-grow",
                    !isAddress(item.address || "") && "text-red-600"
                  )}
                  onChange={(e) => setAddress(e, i)}
                />
                <Input
                  type="text"
                  placeholder="100"
                  value={item.percentage}
                  className={cn(
                    "w-20 text-right",
                    !isPercentageValid(item.percentage || "") && "text-red-600"
                  )}
                  onChange={(e) => setPercentage(e, i)}
                />
                <Button variant="outline" onClick={() => removeItem(i)}>
                  <MinusCircle className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          {percentageError && (
            <div className="text-red-600 text-sm">Sum of units must be 100</div>
          )}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setAllowList((allowList) => [...allowList, {}])}
            >
              <PlusCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 justify-evenly w-full">
          <DialogClose asChild>
            <Button type="button" variant="secondary" className="flex-grow">
              Close
            </Button>
          </DialogClose>
          <Button
            className="flex-grow"
            disabled={createButtonDisabled}
            onClick={submitList}
          >
            {isPending && (
              <LoaderCircle className="h-4 w-4 animate-spin mr-1" />
            )}
            {isPending ? "Creating" : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
