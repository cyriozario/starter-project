import React from "react";
import { Link } from "react-router-dom";

function Item({
  title,
  name,
  thumbnail,
  view,
  channelPicture,
  ago,
  videoId,
  description,
  subscribers,
  categoryId,
  likeCount,
  commentCount,
}) {
  const url = `/playvideo/${videoId}/${encodeURIComponent(
    title
  )}/${encodeURIComponent(name)}/${encodeURIComponent(
    view
  )}/${encodeURIComponent(channelPicture)}/${encodeURIComponent(
    ago
  )}/${encodeURIComponent(
    description || "Description Unavailable"
  )}/${encodeURIComponent(subscribers)}/${encodeURIComponent(
    categoryId
  )}/${encodeURIComponent(likeCount)}/${encodeURIComponent(commentCount)}`;

  return (
    <Link to={url} className="flex flex-col gap-2 video-item">
      <div>
        <img className="rounded-lg w-full" src={thumbnail} alt="" />
      </div>

      <div className="flex gap-4">
        <div className="max-w-10">
          <img className="rounded-full" src={channelPicture} alt="" />
        </div>

        <div className="flex-1">
          <h1 className="font-semibold text-xl item-title xl:text-base 2xl:text-sm">
            {title}
          </h1>

          <p className="text-home xl:text-sm 2xl:text-xs">{name}</p>

          <div className="flex gap-2 items-center">
            <p className="text-home xl:text-sm item-text 2xl:text-xs">
              {view} views
            </p>

            <p className="text-home xl:text-sm item-text 2xl:text-xs">{ago}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default Item;
