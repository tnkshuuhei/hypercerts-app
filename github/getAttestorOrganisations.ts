import { AttestorOrganisation } from "./types/attestor-organisation.type";

export async function getAttestorOrganisations(): Promise<
  AttestorOrganisation[]
> {
  const res = await fetch(
    "https://raw.githubusercontent.com/hypercerts-org/hypercerts-attestor-registry/refs/heads/main/org.json",
  );
  return res.json();
}
