import React from "react";

function CommentsHeader({ commentCount }) {
  return (
    <div className="flex items-center">
      <h2 className="font-semibold text-sm">Comments {commentCount}</h2>
    </div>
  );
}

export default CommentsHeader;
