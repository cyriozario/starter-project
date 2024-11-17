import axios from "axios";
import React, { useState, useEffect } from "react";
import Button from "./Button";

function RelatedVideos({
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
  api,
  videoId,
  fetchViewCount,
  DecodeHTML,
  convertValue,
  calculateTimeAgo,
}) {
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [relatedList, setRelatedList] = useState([]);

  const handleCategoryClick = (category) => {
    if (category === "All") {
      setSelectedCategory("All");
    } else {
      setSelectedCategory(category);
    }
  };

  useEffect(() => {
    fetchRelated(selectedCategory);
  }, [selectedCategory]);

  const fetchRelated = async (selectedCategory) => {
    try {
      const videoInfo = await axios.get(
        "https://www.googleapis.com/youtube/v3/videos",
        {
          params: {
            part: "snippet",
            id: videoId,
            key: api,
          },
        }
      );

      const video = videoInfo.data.items[0];
      const channelName = video.snippet.channelTitle;

      const relatedList = ["All", channelName];
      setRelatedList(relatedList);

      const query = `channel:${channelName}`;

      const searchResponse = await axios.get(
        "https://www.googleapis.com/youtube/v3/search",
        {
          params: {
            part: "snippet",
            type: "video",
            q: query,
            maxResults: 25,
            key: api,
          },
        }
      );

      const filteredRelated = searchResponse.data.items.filter((item) => {
        if (selectedCategory === "All") {
          return item.snippet.id !== videoId;
        } else {
          return (
            item.id.videoId !== videoId &&
            item.snippet.channelTitle === channelName
          );
        }
      });

      // using 'Promise.all' to wait for all promises to resolve.
      const modifiedRelated = await Promise.all(
        filteredRelated.map(async (item) => {
          const id = item.id.videoId;
          const title = item.snippet.title;

          try {
            const viewCount = await fetchViewCount(id);
            const convertedView = convertValue(viewCount);
            // Wait for the fetchViewCount to resolve.
            // viewCount contains the resolved value of promise.

            const uploadTime = item.snippet.publishedAt;
            const timeAgo = calculateTimeAgo(uploadTime);

            const decodedHtml = DecodeHTML(title);
            return {
              ...item,
              snippet: { ...item.snippet, title: decodedHtml },
              viewCount: convertedView,
              timeAgo: timeAgo,
            };
          } catch (error) {
            console.error("Error fetching view count:", error);
            return { ...item, viewCount: 0 };
          }
        })
      );

      const viewCountFilter = modifiedRelated.filter((item) => {
        const viewCountStr = item.viewCount;
        let viewCountNum;

        if (viewCountStr.endsWith("k")) {
          viewCountNum = parseInt(viewCountStr.replace("k", "000"));
        } else if (viewCountStr.endsWith("M")) {
          viewCountNum = parseInt(viewCountStr.replace("M", "000000"));
        } else {
          viewCountNum = parseInt(viewCountStr);
        }

        return viewCountNum >= 100000;
      });

      setRelatedVideos(viewCountFilter);
    } catch (error) {
      console.error("Error fetching related videos:", error);
    }
  };

  return (
    <div className="related-videos">
      <div className="flex gap-1 overflow-hidden whitespace-nowrap">
        {relatedList.map((item, index) => (
          <Button
            item={item}
            key={index}
            selectedCategory={selectedCategory}
            handleCategoryClick={handleCategoryClick}
          />
        ))}
      </div>

      <div className="py-1 flex flex-col gap-4 related-video-list mt-4 relative">
        {relatedVideos.map((item, index) => {
          return (
            <div key={index} className="flex gap-2">
              <div className="max-w-40">
                <img
                  className="w-full rounded-lg"
                  src={item.snippet.thumbnails?.medium?.url}
                  alt={item.snippet.title}
                />
              </div>

              <div className="flex flex-1 gap-4">
                <div>
                  <h1 className="text-base md:text-sm font-semibold title">
                    {item.snippet.title}
                  </h1>

                  <div>
                    <p className="text-title">{item.snippet.channelTitle}</p>

                    <div className="flex gap-2 items-center">
                      <p className="text-small">{item.viewCount} views</p>
                      <p className="text-small">{item.timeAgo}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedVideos;
