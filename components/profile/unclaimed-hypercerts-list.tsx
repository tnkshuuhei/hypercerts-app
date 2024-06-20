import UnclaimedHypercertListItem from "./unclaimed-hypercert-list-item";
import { getAllowListRecordsForAddress } from "@/allowlists/getAllowListRecordsForAddress";

export default async function UnclaimedHypercertsList({
  address,
}: {
  address: string;
}) {
  const allowList = await getAllowListRecordsForAddress(address);

  if (
    !allowList ||
    allowList.count === 0 ||
    !allowList.data ||
    !Array.isArray(allowList.data) ||
    allowList.data.length === 0
  ) {
    return <div>No unclaimed hypercerts found</div>;
  }

  // const mockUnclaimedHypercerts: { count: number; data: AllowListRecord[] } = {
  //   count: 3,
  //   data: [
  //     {
  //       id: "1",
  //       hypercert_id:
  //         "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-15993271245284107782778606549293105938432",
  //       token_id: "1",
  //       user_address: "0x123",
  //       claimed: false,
  //       proof: [""],
  //       units: "1",
  //       total_units: "1",
  //       entry: 0,
  //       leaf: "",
  //     },
  //     {
  //       id: "2",
  //       hypercert_id:
  //         "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-3062541302288446171170371466885913903104",
  //       token_id: "1",
  //       user_address: "0x123",
  //       claimed: false,
  //       proof: [""],
  //       units: "1",
  //       total_units: "1",
  //       entry: 0,
  //       leaf: "",
  //     },
  //     {
  //       id: "3",
  //       hypercert_id:
  //         "11155111-0xa16DFb32Eb140a6f3F2AC68f41dAd8c7e83C4941-5784800237655953878877368326340059594752",
  //       token_id: "1",
  //       user_address: "0x123",
  //       claimed: false,
  //       proof: [""],
  //       units: "1",
  //       total_units: "1",
  //       entry: 0,
  //       leaf: "",
  //     },
  //   ],
  // };

  return (
    <div className="flex flex-col gap-5 w-full">
      {allowList.data.map((unclaimedHypercert, i) => (
        <UnclaimedHypercertListItem
          allowListRecordFragment={unclaimedHypercert}
          key={i}
        />
      ))}
    </div>
  );
}
