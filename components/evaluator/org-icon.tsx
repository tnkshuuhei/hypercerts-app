import OrgIconInner from "./org-icon-inner";
import { getAttestorOrganisation } from "../../github/getAttetstorOrganisation";

export default async function OrgIcon({ orgId }: { orgId: string }) {
  const org = await getAttestorOrganisation({ orgId });
  if (!org) return null;

  return <OrgIconInner org={org} />;
}
