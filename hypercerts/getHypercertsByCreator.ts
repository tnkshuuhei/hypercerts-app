import "server-only";

import {graphql, readFragment} from "@/lib/graphql";

import {HYPERCERTS_API_URL} from "@/configs/hypercerts";
import {HypercertListFragment} from "@/hypercerts/fragments/hypercert-list.fragment";
import request from "graphql-request";

const query = graphql(
        `
        query AllHypercerts($where: HypercertsWhereInput) {
            hypercerts(where: $where, count: COUNT) {
                count
                data {
                    ...HypercertListFragment
                }
            }
        }
    `,
    [HypercertListFragment],
);

export async function getHypercertsByCreator({
                                                 creatorAddress,
                                             }: {
    creatorAddress: string;
}) {
    const res = {
        count: null,
        data: null
    }

    try {
        const queryRes = await request(HYPERCERTS_API_URL, query, {
            where: {
                creator_address: {
                    contains: creatorAddress,
                },
            },
        });

        // TODO: Throw error?
        if (!queryRes.hypercerts?.data) {
            return undefined;
        }

        res.count = queryRes.hypercerts.count;
        res.data = queryRes.hypercerts.data.map((hypercert) => {
            return readFragment(HypercertListFragment, hypercert);
        })

        return res;
    } catch (e) {
        console.error(`[getHypercertsByCreator] Error fetching hypercerts by creator: ${(e as Error).message}`);
        return undefined;
    }

}
