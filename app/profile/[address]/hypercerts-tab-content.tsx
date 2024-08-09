import { getHypercertsByCreator } from "@/hypercerts/getHypercertsByCreator";
import { getAllowListRecordsForAddress } from "@/allowlists/getAllowListRecordsForAddress";
import HypercertWindow from "@/components/hypercert/hypercert-window";
import { EmptySection } from "@/app/profile/[address]/sections";
import UnclaimedHypercertsList from "@/components/profile/unclaimed-hypercerts-list";
import { Suspense } from "react";
import ExploreListSkeleton from "@/components/explore/explore-list-skeleton";
import { ProfileSubTabKey, subTabs } from "@/app/profile/[address]/tabs";
import { SubTabsWithCount } from "@/components/profile/sub-tabs-with-count";
import { getHypercertsByOwner } from "@/hypercerts/getHypercertsByOwner";

const HypercertsTabContentInner = async ({
  address,
  activeTab,
}: {
  address: string;
  activeTab: ProfileSubTabKey;
}) => {
  const createdHypercerts = await getHypercertsByCreator({
    creatorAddress: address,
  });

  const ownedHypercerts = await getHypercertsByOwner({
    ownerAddress: address,
  });

  const allowlist = await getAllowListRecordsForAddress(address);

  // TODO: Do this in the query. Currently it doesn't support multiple filters at the same time
  const unclaimedHypercerts =
    allowlist?.data.filter((item) => !item.claimed) || [];

  const isEmptyAllowlist =
    !allowlist ||
    allowlist.count === 0 ||
    !allowlist.data ||
    !Array.isArray(allowlist.data);

  const showCreatedHypercerts =
    createdHypercerts?.data && createdHypercerts.data.length > 0;
  const showOwnedHypercerts =
    ownedHypercerts?.data && ownedHypercerts.data.length > 0;
  const hypercertSubTabs = subTabs.filter(
    (tab) => tab.key.split("-")[0] === "hypercerts",
  );

  const tabBadgeCounts: Partial<
    Record<(typeof subTabs)[number]["key"], number>
  > = {
    "hypercerts-created": createdHypercerts?.count ?? 0,
    "hypercerts-owned": ownedHypercerts?.count ?? 0,
    "hypercerts-claimable": unclaimedHypercerts.length,
  };

  return (
    <section>
      <SubTabsWithCount
        address={address}
        activeTab={activeTab}
        tabBadgeCounts={tabBadgeCounts}
        tabs={hypercertSubTabs}
      />

      {activeTab === "hypercerts-created" &&
        (showCreatedHypercerts ? (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] gap-4 py-4">
            {createdHypercerts.data.map((hypercert) => {
              return (
                <HypercertWindow
                  key={hypercert.hypercert_id}
                  hypercert={hypercert}
                />
              );
            })}
          </div>
        ) : (
          <section className="pt-4">
            <EmptySection />
          </section>
        ))}

      {activeTab === "hypercerts-owned" &&
        (showOwnedHypercerts ? (
          <div className="grid grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] gap-4 py-4">
            {ownedHypercerts.data.map((hypercert) => {
              return (
                <HypercertWindow
                  key={hypercert.hypercert_id}
                  hypercert={hypercert}
                />
              );
            })}
          </div>
        ) : (
          <section className="pt-4">
            <EmptySection />
          </section>
        ))}

      {activeTab === "hypercerts-claimable" && (
        <section className="pt-4">
          <UnclaimedHypercertsList
            unclaimedHypercerts={unclaimedHypercerts}
            isEmptyAllowlist={isEmptyAllowlist}
          />
        </section>
      )}
    </section>
  );
};

const HypercertsTabContent = ({
  address,
  activeTab,
}: {
  address: string;
  activeTab: ProfileSubTabKey;
}) => {
  return (
    <Suspense fallback={<ExploreListSkeleton length={4} />}>
      <HypercertsTabContentInner address={address} activeTab={activeTab} />
    </Suspense>
  );
};
export { HypercertsTabContent };
