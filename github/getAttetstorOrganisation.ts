import { getAttestorOrganisations } from "./getAttestorOrganisations";

export async function getAttestorOrganisation({ orgId }: { orgId: string }) {
  const attestorOrganisations = await getAttestorOrganisations();
  return attestorOrganisations.find((org) => org.id === orgId);
}
