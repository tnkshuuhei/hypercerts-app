import React from "react";

export default function Tags({
  tags,
  ...props
}: {
  tags?: string[];
  [key: string]: any;
}) {
  if (!tags || tags.length === 0) return null;
  return (
    <div className="flex flex-col items-start w-full" {...props}>
      <div className="flex items-start w-full gap-1" {...props}>
        {tags.map((tag, index) => (
          <div key={index}>{tag}</div>
        ))}
      </div>
    </div>
  );
}
