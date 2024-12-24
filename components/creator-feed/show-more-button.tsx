import { Button } from "../ui/button";

export const ShowMoreButton = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) => (
  <Button
    variant="link"
    onClick={() => setIsExpanded((prev) => !prev)}
    className="text-sm w-max p-0"
  >
    {isExpanded ? "Collapse updates" : "Show more updates"}
  </Button>
);
