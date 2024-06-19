import UnclaimedHypercertsList from "../../../components/profile/unclaimed-hypercerts-list";

export default function Profile2({ params }: { params: { address: string } }) {
  const { address } = params;
  return (
    <main className="flex flex-col p-8 md:px-24 md:pt-14 pb-24 space-y-4">
      <h1 className="font-serif text-2xl lg:text-3xl tracking-tight">
        Unclaimed hypercerts
      </h1>
      <UnclaimedHypercertsList address={address} />
    </main>
  );
}
