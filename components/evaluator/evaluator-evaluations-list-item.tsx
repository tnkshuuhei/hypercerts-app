import { EvaluationData } from "../../eas/types/evaluation-data.type";
import FormattedDate from "../formatted-date";
import Link from "next/link";
import { getDecodedValue } from "../../eas/getDecodedValue";

export default function EvaluatorEvaluationsListItem({
  blockTimestamp,
  data,
}: {
  blockTimestamp: string | null | undefined;
  data: EvaluationData;
}) {
  console.log(data);

  const hypercertId = `${data.chain_id}-${data.contract_address}-${data.token_id}`;
  return (
    // <Flex
    //   direction="column"
    //   _hover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
    //   h="100%"
    //   onClick={() => router.push(`/claim/${hypercertId}`)}
    //   cursor="pointer"
    //   {...props}
    // >
    //   <Link href={`/claim/${hypercertId}`}>
    //     <Flex direction="column" p={5} gap={4} h="100%">
    //       <FormattedDate seconds={created} />
    //       <ClaimRow claimId={hypercertId} />
    //       <Evaluations
    //         basic={evaluateBasic}
    //         work={evaluateWork}
    //         properties={evaluateProperties}
    //         contributors={evaluateContributors}
    //       />
    //       <Tags tags={tags} />
    //       <Comments comments={comments} />
    //     </Flex>
    //   </Link>
    // </Flex>
    <Link href={`/hypercert/${hypercertId}`}>
      <FormattedDate seconds={blockTimestamp} />
    </Link>
  );
}
