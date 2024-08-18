import { ArrowUpRight, ExternalLinkIcon } from "lucide-react";
import { isValidUrl } from "../../lib/isValidUrl";

const URL_MAX_LENGTH = 40;

export default function ExternalUrl({
  url,
}: {
  url: string | null | undefined;
}) {
  if (!url || !isValidUrl(url)) {
    return null;
  }

  const urlDescription =
    url.length > URL_MAX_LENGTH
      ? url.substring(0, URL_MAX_LENGTH) + "..."
      : url;

  return (
    <a
      href={url}
      title={url}
      target="_blank"
      rel="norefferer"
      className="flex items-center group text-blue-600 px-2 py-1 bg-blue-50 hover:bg-blue-100 w-max rounded-lg text-sm font-medium"
    >
      <span>{urlDescription}</span>
      <ArrowUpRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 duration-200" />
    </a>
  );
}
