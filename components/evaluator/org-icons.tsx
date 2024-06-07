import OrgIcon from "./org-icon";

export default function OrgIcons({ orgIds }: { orgIds: string[] }) {
  return (
    <div className="flex gap-2">
      {orgIds.map((orgId) => (
        <OrgIcon key={orgId} orgId={orgId} />
      ))}
    </div>
  );
}
