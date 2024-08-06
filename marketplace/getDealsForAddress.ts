import "server-only";

import {graphql, readFragment} from "@/lib/graphql";
import {SaleFragment} from "@/marketplace/fragments/sale.fragment";
import {HYPERCERTS_API_URL} from "@/configs/hypercerts";
import request from "graphql-request";

const sellQuery = graphql(
        `
        query GetSalesForAddress($address: String!) {
            sales(where: {seller: { eq: $address } }) {
                data {
                    ...SaleFragment
                }
            }
        }
    `,
    [SaleFragment],
);

const buyQuery = graphql(
        `
        query GetSalesForAddress($address: String!) {
            sales(where: { buyer: { eq: $address } }) {
                data {
                    ...SaleFragment
                }
            }
        }
    `,
    [SaleFragment],
);

export async function getDealsForAddress(address: string) {
    const buyRes = await request(HYPERCERTS_API_URL, buyQuery, {
        address,
    });

    const sellRes = await request(HYPERCERTS_API_URL, sellQuery, {
        address,
    });

    if (!buyRes.sales?.data || !sellRes.sales?.data) {
        return undefined;
    }

    const processedBuyFragments = buyRes.sales.data.map((order) => {
        return readFragment(SaleFragment, order);
    });

    const processedSellFragments = sellRes.sales.data.map((order) => {
        return readFragment(SaleFragment, order);
    });

    return {
        buys: {
            count: processedBuyFragments.length,
            data: processedBuyFragments,
        },
        sells: {
            count: processedSellFragments.length,
            data: processedSellFragments,
        },
    };
}
