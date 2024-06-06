import * as R from "remeda";

import { HypercertFull } from "../../hypercerts/fragments/hypercert-full.fragment";

export default function WorkScope({ hypercert }: { hypercert: HypercertFull }) {
  const workScope =
    R.isArray(hypercert.metadata?.work_scope) &&
    hypercert.metadata?.work_scope.length > 0
      ? hypercert.metadata?.work_scope
      : null;

  return (
    <div className="flex flex-col w-full">
      <span>Work Scope</span>
      <div className="flex flex-wrap gap-1">
        {workScope
          ? workScope.map((scope, i) => <span key={i}>{scope}</span>)
          : "No work scope"}
      </div>
    </div>
  );
}
