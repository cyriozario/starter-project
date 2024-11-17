import React, { useState, useEffect, useRef } from "react";
import Axios from "axios";
import { AiFillLike } from "react-icons/ai";
import { BiSolidDislike } from "react-icons/bi";
import { GoChevronDown } from "react-icons/go";
import axios from "axios";
import Reply from "./Reply";

function Comments({ api, videoId, calculateTimeAgo }) {
  const [commentData, setCommentData] = useState([]);
  const [replyData, setReplyData] = useState([]);
  const [replyVisibility, setReplyVisibility] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);

  const maxResults = 25;

  useEffect(() => {
    fetchComments(null, maxResults);
  }, []);

  const loadMoreComments = async () => {
    if (!nextPageToken) return;
    await fetchComments(nextPageToken, maxResults);
  };

  const fetchComments = async (pageToken, maxResults) => {
    try {
      const response = await Axios.get(
        "https://www.googleapis.com/youtube/v3/commentThreads",
        {
          params: {
            part: "snippet",
            videoId: videoId,
            key: api,
            pageToken: pageToken || null,
            maxResults: maxResults,
          },
        }
      );

      setCommentData((prevCommentData) => {
        const newComments = response.data.items.map((item) => {
          const publishedTime =
            item.snippet.topLevelComment.snippet.publishedAt;
          const timeAgo = calculateTimeAgo(publishedTime);
          return { ...item, timeAgo: timeAgo };
        });
        return [...prevCommentData, ...newComments];
      });

      setNextPageToken(response.data.nextPageToken);
    } catch (error) {
      console.log("Error fetching comments", error.message);
    }
  };

  const fetchReplies = async (parentId) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/youtube/v3/comments",
        {
          params: {
            part: "snippet",
            videoId: videoId,
            parentId: parentId,
            key: api,
          },
        }
      );
      setReplyData(response.data.items);
    } catch (error) {
      console.log("Error fetching replies", error.message);
    }
  };

  const toggleReplies = async (commentId) => {
    setReplyVisibility((prevVisibility) => {
      return {
        ...prevVisibility,
        [commentId]: !prevVisibility[commentId],
      };
    });

    if (!replyVisibility[commentId]) {
      await fetchReplies(commentId);
    }
  };

  return (
    <div>
      <div className="px-4 py-2 flex flex-col gap-4 mb-4">
        <h3 className="text-base font-semibold">Comments 2K</h3>

        <div className="flex flex-col gap-4">
          {commentData.map((comment, index) => {
            const commentId = comment.snippet.topLevelComment.id;
            return (
              <div key={index}>
                <div className="flex gap-4">
                  <div className="flex-none">
                    <img
                      src={
                        comment.snippet.topLevelComment.snippet
                          .authorProfileImageUrl
                      }
                      alt="profile"
                      className="rounded-full w-8 h-8 object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex gap-2">
                      <h3 className="text-sm font-bold">
                        {
                          comment.snippet.topLevelComment.snippet
                            .authorDisplayName
                        }
                      </h3>
                      <p className="text-sm">{comment.timeAgo}</p>
                    </div>

                    <p className="text-sm">
                      {comment.snippet.topLevelComment.snippet.textOriginal}
                    </p>

                    <div className="flex gap-4 items-center mt-2">
                      <div className="flex gap-1 items-center">
                        <AiFillLike size={20} className="text-gray-400" />
                        <p>
                          {comment.snippet.topLevelComment.snippet.likeCount}
                        </p>
                      </div>

                      <BiSolidDislike size={20} className="text-gray-400" />
                    </div>
                  </div>
                </div>

                {comment.snippet.totalReplyCount === 1 ? (
                  <div
                    className="flex items-center gap-2 p-2 ml-12 w-fit cursor-pointer"
                    onClick={() => toggleReplies(commentId)}
                  >
                    <GoChevronDown className="fill-blue-600" />
                    <p className="text-blue-600">
                      {comment.snippet.totalReplyCount} Reply
                    </p>
                  </div>
                ) : comment.snippet.totalReplyCount > 0 ? (
                  <div
                    className="flex items-center gap-2 p-2 ml-12 w-fit cursor-pointer"
                    onClick={() => toggleReplies(commentId)}
                  >
                    <GoChevronDown className="fill-blue-600" />
                    <p className="text-blue-600">
                      {comment.snippet.totalReplyCount} Replies
                    </p>
                  </div>
                ) : (
                  ""
                )}

                {replyVisibility[commentId] && <Reply replyData={replyData} />}
              </div>
            );
          })}
        </div>
        <button
          className="text-black bg-stone-100 w-full py-2 rounded-lg text-sm font-semibold shadow-sm"
          onClick={loadMoreComments}
        >
          Load more...
        </button>
      </div>
    </div>
  );
}

export default Comments;
