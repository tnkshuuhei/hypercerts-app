"use client";

import { truncate } from "lodash";
import { useState } from "react";

interface CommentsProps {
  comments?: string;
}

export default function Comments({ comments }: CommentsProps) {
  const [showFullComments, setShowFullComments] = useState(false);
  if (!comments) return null;

  // Truncate the comments to a maximum of 200 characters
  // If the comments are longer than 200 characters, display the first 200 characters and add an ellipsis
  // If the comments are shorter than 200 characters, display the full comments
  // When the user clicks on 'Show full comments', display the full comments and replace the button with 'Show less'

  // // generate random text for testing purposes
  const text =
    "Fuga qui expedita sit labore repellendus esse. Dolorem quisquam voluptates error provident. Saepe quisquam atque consequatur repudiandae cupiditate. Et cupiditate rem laboriosam eveniet ut praesentium aliquam. Et recusandae possimus excepturi est dolores laudantium sed. Tempora voluptatem quae fuga assumenda. Repudiandae commodi eius sapiente optio ducimus. In laboriosam rerum aut nam suscipit repudiandae et. Ab ut sequi inventore soluta eum suscipit molestiae unde. Sit et est modi. Totam dolores culpa consequuntur id esse impedit quo omnis.";

  const truncatedComments = truncate(text, {
    length: 200,
    separator: "...",
  });

  const showFullCommentsButton = showFullComments ? (
    <button
      className="text-xs font-medium text-slate-700"
      onClick={() => setShowFullComments(false)}
    >
      Show less
    </button>
  ) : (
    <button
      className="text-xs font-medium text-slate-700"
      onClick={() => setShowFullComments(true)}
    >
      Show full comments
    </button>
  );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <div className="overflow-hidden text-sm text-slate-700">
          {showFullComments ? text : truncatedComments}
        </div>
      </div>
      <div>
        <div className="flex justify-center">{showFullCommentsButton}</div>
      </div>
    </div>
  );
}
