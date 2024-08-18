import { getAttestorOrganisation } from "../../github/getAttetstorOrganisation";
import Image from "next/image";

export default async function OrgItem({ org }: { org: string }) {
  const orgDetails = await getAttestorOrganisation({ orgId: org });
  if (!orgDetails) return null;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full w-8 h-8"
          alt={orgDetails.name}
          src={orgDetails.logo_url}
          width={32}
          height={32}
        />
        <p>
          <a href={orgDetails.org_url} target="_blank" rel="noreferrer">
            {orgDetails.name}
          </a>
        </p>
      </div>
      <p>{orgDetails.description}</p>
    </div>
  );
}
