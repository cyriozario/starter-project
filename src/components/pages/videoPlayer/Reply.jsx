import React from "react";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";

function Reply({ replyData }) {
  return (
    <div className="flex flex-col gap-4">
      {replyData.map((reply) => (
        <div className="flex gap-4 px-12">
          <div className="flex-none">
            <img
              src={reply.snippet.authorProfileImageUrl}
              alt="profile"
              className="rounded-full w-6 h-6 object-cover"
            />
          </div>

          <div className="w-full">
            <div className="flex gap-2 items-center">
              <h3 className="font-bold text-xs">
                {reply.snippet.authorDisplayName}
              </h3>
              <p className="text-xs">1 minute ago</p>
            </div>

            <p className="text-sm break-all">{reply.snippet.textOriginal}</p>

            <div className="flex gap-4 items-center mt-2">
              <div className="flex gap-1 items-center">
                <AiFillLike size={20} className="text-gray-400" />
                <p>1</p>
              </div>

              <BiSolidDislike size={20} className="text-gray-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Reply;
