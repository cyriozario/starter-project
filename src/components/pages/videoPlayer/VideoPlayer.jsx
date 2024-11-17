import axios from "axios";
import React, { useState, useEffect } from "react";

function VideoPlayer({ api, videoId }) {
  const [embedCode, setEmbedCode] = useState("");

  async function fetchEmbedCode(videoId, api) {
    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/videos",
      {
        params: {
          part: "snippet",
          id: videoId,
          key: api,
        },
      }
    );
    const videoIdFromResp = response.data.items[0].id;
    const embedCode = videoIdFromResp
      ? `https://www.youtube.com/embed/${videoIdFromResp}`
      : null;
    setEmbedCode(embedCode);
  }

  useEffect(() => {
    fetchEmbedCode(videoId, api);
  }, [videoId]);

  return (
    <div className="video-wrapper">
      {embedCode ? <iframe src={embedCode} /> : <div>Loading video...</div>}
    </div>
  );
}

export default VideoPlayer;
