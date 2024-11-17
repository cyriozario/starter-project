import React from "react";
import Item from "../shared/Item";
import "../../../src/App.css";

function Home({ videoData, convertValue }) {
  const updatedVideoData = videoData.map((item) => {
    const viewCount = item.statistics.viewCount;
    const convertedView = convertValue(viewCount);

    const subscribers = item.subscribers;
    const convertedSub = convertValue(subscribers);

    const likeCount = item.statistics.likeCount;
    const convertedLike = convertValue(likeCount);

    const commentCount = item.statistics.commentCount;
    const convertedComment = convertValue(commentCount);

    return {
      ...item,
      statistics: {
        ...item.statistics,
        viewCount: convertedView,
        likeCount: convertedLike,
        commentCount: convertedComment,
      },
      subscribers: convertedSub,
    };
  });

  return (
    <div className="video-list xl:grid-cols-4 2xl:grid-cols-5 bg-white opacity-90 grid grid-cols-1 gap-4 p-4">
      {updatedVideoData.map((item, index) => (
        <Item
          thumbnail={
            item.snippet.thumbnails?.maxres?.url ||
            item.snippet.thumbnails?.medium?.url
          }
          title={item.snippet.title}
          name={item.snippet.channelTitle}
          view={item.statistics.viewCount}
          ago={item.timeAgo}
          channelPicture={item.channelPicture}
          videoId={item.id}
          description={item.snippet.description}
          subscribers={item.subscribers}
          categoryId={item.snippet.categoryId}
          likeCount={item.statistics.likeCount}
          commentCount={item.statistics.commentCount}
          key={index}
        />
      ))}
    </div>
  );
}

export default Home;
