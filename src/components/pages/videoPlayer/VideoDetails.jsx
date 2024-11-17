import React, { useState } from "react";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { IoMdShareAlt } from "react-icons/io";
import { MdLibraryMusic } from "react-icons/md";

function VideoDetails({
  title,
  name,
  view,
  channelPicture,
  ago,
  description,
  subscribers,
  likeCount,
}) {
  const [showFullDescription, setShowFullDescripton] = useState(false);
  const toggleDescription = () => {
    setShowFullDescripton(!showFullDescription);
  };
  return (
    <div>
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">{title}</h1>

        <div className="flex items-cente">
          <p className="text-sm">{view} views</p>
          <span className="mx-1">&middot;</span>
          <p className="text-sm">{ago}</p>
        </div>

        <div className="flex gap-4">
          <div className="flex gap-4">
            <div className="flex gap-1 items-center">
              <AiFillLike className="text-gray-400" size={20} />
              <p>{likeCount}</p>
            </div>

            <div className="flex gap-2 items-center">
              <BiSolidDislike className="text-gray-400" size={20} />
              <p>2</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex gap-2 items-center">
              <IoMdShareAlt className="text-gray-400" size={20} />
              <p>Share</p>
            </div>

            <div className="flex gap-2 items-center">
              <MdLibraryMusic className="text-gray-400" size={20} />
              <p>Save</p>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4 border-gray-300 w-full" />

      <div>
        <div className="flex items-center gap-4">
          <div>
            <img className="w-10 rounded-full" src={channelPicture} />
          </div>
          <div className="grow">
            <h2 className="font-bold text-lg">{name}</h2>
            <p>{subscribers} Subscribers</p>
          </div>
          <button className="bg-red-500 px-8 py-2 rounded-md text-white text-sm">
            Subscribe
          </button>
        </div>

        <div className="mt-4 py-4">
          <p className="text-sm bg-stone-100 p-4 rounded-lg shadow-sm">
            <span style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {showFullDescription
                ? description
                : `${description.slice(0, 250)}...`}
            </span>
            {description.length > 250 && (
              <span
                onClick={toggleDescription}
                style={{ cursor: "pointer", color: "blue" }}
              >
                {showFullDescription ? (
                  <div className="my-2">Show less</div>
                ) : (
                  <span>more</span>
                )}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoDetails;
