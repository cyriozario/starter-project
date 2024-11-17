import React from "react";
import VideoPlayer from "./VideoPlayer";
import VideoDetails from "./VideoDetails";
import { useParams } from "react-router-dom";
import Comments from "./Comments";
import RelatedVideos from "./RelatedVideos";

function VideoPlayerPage({
  api,
  calculateTimeAgo,
  fetchViewCount,
  fetchChannelPicture,
  DecodeHTML,
  convertValue,
}) {
  const {
    videoId,
    title,
    name,
    view,
    channelPicture,
    ago,
    description,
    subscribers,
    categoryId,
    likeCount,
    commentCount,
  } = useParams();

  return (
    <div className="px-6 mt-1 video-player">
      <div className="player-details">
        <VideoPlayer api={api} videoId={videoId} />
        <VideoDetails
          title={title}
          name={name}
          view={view}
          channelPicture={channelPicture}
          ago={ago}
          description={description}
          subscribers={subscribers}
          likeCount={likeCount}
          convertValue={convertValue}
        />
        <Comments
          api={api}
          videoId={videoId}
          commentCount={commentCount}
          calculateTimeAgo={calculateTimeAgo}
        />
      </div>

      <RelatedVideos
        title={title}
        name={name}
        view={view}
        channelPicture={channelPicture}
        ago={ago}
        description={description}
        subscribers={subscribers}
        likeCount={likeCount}
        commentCount={commentCount}
        fetchViewCount={fetchViewCount}
        fetchChannelPicture={fetchChannelPicture}
        calculateTimeAgo={calculateTimeAgo}
        api={api}
        videoId={videoId}
        categoryId={categoryId}
        DecodeHTML={DecodeHTML}
        convertValue={convertValue}
      />
    </div>
  );
}

export default VideoPlayerPage;
