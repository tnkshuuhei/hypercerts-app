import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export function CopyButton({
  textToCopy,
}: {
  textToCopy?: string;
}): JSX.Element {
  return (
    <Button
      onClick={(event): void => {
        event.stopPropagation();
        if (!textToCopy) {
          return;
        }
        void navigator.clipboard.writeText(textToCopy);
        // toast({
        //   title: "Copied.",
        //   status: "info",
        //   duration: 1000,
        //   position: "top",
        // });
      }}
      variant={"outline"}
      size={"icon"}
    >
      <Copy />
    </Button>
  );
}
