import { ResultOf, graphql } from "@/lib/graphql";

export const SaleFragment = graphql(`
    fragment SaleFragment on Sale {
        id
        buyer
        seller
        strategy_id
        currency
        collection
        item_ids
        hypercert_id
        amounts
        transaction_hash
        creation_block_number
        creation_block_timestamp
        hypercert {
            units
            metadata {
                name
            }
        }
    }
`);

export type SaleFragment = ResultOf<typeof SaleFragment>;
