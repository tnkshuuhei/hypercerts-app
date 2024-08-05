import {Suspense} from "react";
import UserListingsList from "@/components/marketplace/user-listings-list";
import {getOrders} from "@/marketplace/getOpenOrders";
import {
    createTabRoute,
    ProfileSubTabKey,
    subTabs,
} from "@/app/profile/[address]/tabs";
import Link from "next/link";
import {cn} from "@/lib/utils";
import CountBadge from "@/components/count-badge";
import {getDealsForAddress} from "@/marketplace/getDealsForAddress";
import UserDealsList from "@/components/marketplace/user-deals-list";
import ExploreListSkeleton from "@/components/explore/explore-list-skeleton";
import {SubTabsWithCount} from "@/components/profile/sub-tabs-with-count";

const MarketplaceTabContentInner = async ({
                                              address,
                                              activeTab,
                                          }: {
    address: string;
    activeTab: ProfileSubTabKey;
}) => {
    const orders = await getOrders({
        filter: {signer: address as `0x${string}`},
    });

    const deals = await getDealsForAddress(address);
    const {buys, sells} = deals || {};

    const marketplaceSubTabs = subTabs.filter(
        (tab) => tab.key.split("-")[0] === "marketplace",
    );

    const tabBadgeCounts: Partial<
        Record<(typeof subTabs)[number]["key"], number>
    > = {
        "marketplace-listings": orders?.count ?? 0,
        "marketplace-bought": buys?.count ?? 0,
        "marketplace-sold": sells?.count ?? 0,
    };
    return (
        <section>
            < SubTabsWithCount
                address={address}
                activeTab={activeTab}
                tabBadgeCounts={tabBadgeCounts}
                tabs={marketplaceSubTabs}
            />
            {activeTab === "marketplace-listings" && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UserListingsList address={address} orders={orders?.data || []}/>
                </Suspense>
            )}

            {activeTab === "marketplace-bought" && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UserDealsList address={address} deals={buys?.data || []}/>
                </Suspense>
            )}

            {activeTab === "marketplace-sold" && (
                <Suspense fallback={<div>Loading...</div>}>
                    <UserDealsList address={address} deals={sells?.data || []}/>
                </Suspense>
            )}
        </section>
    );
};

const MarketplaceTabContent = ({
                                   address,
                                   activeTab,
                               }: {
    address: string;
    activeTab: ProfileSubTabKey;
}) => {
    return (
        <Suspense fallback={<ExploreListSkeleton length={9}/>}>
            <MarketplaceTabContentInner address={address} activeTab={activeTab}/>
        </Suspense>
    );
};
export {MarketplaceTabContent};
