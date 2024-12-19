"use client";

import { truncate } from "lodash";
import { useState, useMemo } from "react";

interface CommentsProps {
  comments?: string;
}

export default function Comments({ comments }: CommentsProps) {
  const [showFullComments, setShowFullComments] = useState(false);

  const { truncatedComments, isTruncated } = useMemo(() => {
    if (!comments) return { truncatedComments: "", isTruncated: false };
    const truncated = truncate(comments, {
      length: 100,
      separator: "...",
    });
    return {
      truncatedComments: truncated,
      isTruncated: truncated !== comments,
    };
  }, [comments]);

  if (!comments) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm text-slate-700">
        {showFullComments ? comments : truncatedComments}
      </div>
      {isTruncated && (
        <button
          className="text-xs font-medium text-slate-700 hover:underline"
          onClick={() => setShowFullComments(!showFullComments)}
        >
          {showFullComments ? "Show less" : "Show full comments"}
        </button>
      )}
    </div>
  );
}
