export function isValidUrl(urlString: string | undefined | null): boolean {
  if (!urlString) return false;
  try {
    new URL(urlString);
    return true;
  } catch (error) {
    return false;
  }
}
