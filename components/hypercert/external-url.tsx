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
    <a href={url} target="_blank" rel="norefferer">
      {urlDescription}
    </a>
  );
}
