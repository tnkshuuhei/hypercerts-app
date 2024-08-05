"use client";

import React from "react";
import {useHypercertClient} from "@/hooks/use-hypercert-client";
import {getPricePerPercent,} from "@/marketplace/utils";
import {useAccount, useChainId} from "wagmi";
import {useHypercertExchangeClient} from "@/hooks/use-hypercert-exchange-client";
import {SaleFragment} from "@/marketplace/fragments/sale.fragment";
import {useRouter} from "next/navigation";
import {calculateBigIntPercentage} from "@/lib/calculateBigIntPercentage";
import {HypercertMiniDisplayProps} from "@/components/hypercert/hypercert-mini-display";
import type {SupportedChainIdType} from "@/lib/constants";
import HypercertWindow from "@/components/hypercert/hypercert-window";
import {EmptySection} from "@/app/profile/[address]/sections";
import HypercertDealWindow, {HypercertDealMiniDisplayProps} from "@/components/hypercert/hypercert-deal-window";

export default function UserDealsList({
                                          address,
                                          deals,
                                      }: {
    address: string;
    deals: SaleFragment[];
}) {
    return (
        <div className="w-full">

            {deals && deals.length > 0 ? (
                <div className="flex items-center py-4">
                    <div className="grid grid-cols-[repeat(auto-fit,_minmax(270px,_1fr))] gap-4">
                        {deals.map((deal) => {
                            const percentTraded = calculateBigIntPercentage(
                                deal?.amounts?.shift(),
                                deal?.hypercert?.units,
                            );

                            if (!deal.hypercert_id) return;

                            // TODO - get price of traded fraction
                            // const price = getPricePerPercent(
                            //     hypercert.orders?.lowestAvailablePrice || "0",
                            //     BigInt(deal.hypercert?.units || "0"),
                            // );

                            const price = BigInt(0);

                            const hypercertPointer = deal.hypercert_id.split("-");

                            const props: HypercertDealMiniDisplayProps = {
                                hypercertId: deal.hypercert_id,
                                name: deal.hypercert?.metadata?.name as string,
                                chainId: Number(hypercertPointer[0]) as SupportedChainIdType,
                                attestations: {data: null, count: null},
                                price: price.toString(),
                                percentTraded,
                            };
                            return (
                                <HypercertDealWindow {...props} key={deal.transaction_hash}/>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <section className="pt-4">
                    <EmptySection/>
                </section>
            )}
        </div>
    );
}
