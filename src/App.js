import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import "./index.css";
import Axios from "axios";
import Home from "./components/pages/Home";
import VideoPlayerPage from "./components/pages/videoPlayer/VideoPlayerPage";
import he from 'he';

function App() {
  const api_key = "AIzaSyAK8m0vjslZ4EpbjyEGc14tDDXNQvB1vs0";
  const baseURL = "https://www.googleapis.com/youtube/v3";

  const [videoData, setVideoData] = useState([]);
  const [videoDataFetched, setVideoDataFetched] = useState(false);

  const fetchVideos = async () => {
    try {
      if (!videoDataFetched) {
        let allVideos = [];
        let nextPageToken = null;

        // Fetch videos until there are no more nextPageToken.
        do {
          const response = await Axios.get('https://www.googleapis.com/youtube/v3/videos', {
          params: {
            part: "snippet,statistics",
            maxResults: 50, // Fetch 50 videos at a time.
            chart: "mostPopular",
            key: api_key,
            pageToken: nextPageToken, // Pass the nextPageToken to fetch the next page of results.
          }, 
        });
          const result = response.data.items;
          nextPageToken = response.data.nextPageToken;
          allVideos = [...allVideos, ...result ];
        } while (nextPageToken);

        // Process the fetched videos as needed.
        const fetchSubscriberPromises = allVideos.map((item) => {
          const channelId = item.snippet.channelId;
          return fetchSubscriberCount(channelId);
        })

        const subscribers = await Promise.all(fetchSubscriberPromises);
  
        // 'fetchChannelPicturesPromises' is an array of promises.
        const fetchChannelPicturesPromises = allVideos.map((item) => {
          const channelId = item.snippet.channelId;
          return fetchChannelPicture(channelId);
        });
  
        // using 'Promise.all' to wait for all promises to resolve.
        // 'channelPictures' is an array containing the resolved values of promises.
        const channelPictures = await Promise.all(fetchChannelPicturesPromises);
        
        const modifiedResult = allVideos.map((item, index) => {
          const uploadTime = item.snippet.publishedAt;
          const timeAgo = calculateTimeAgo(uploadTime);
  
          return {
            ...item,
            timeAgo: timeAgo,
            channelPicture: channelPictures[index],
            subscribers: subscribers[index],
          };
        });
        setVideoData(modifiedResult);
        setVideoDataFetched(true);
      }
    } catch (error) {
      console.log("Error fetching videos:", error);
    }
  };

  const fetchChannelPicture = async (channelId) => {
    try {
      const response = await Axios.get(`${baseURL}/channels`, {
        params: {
          part: "snippet",
          id: channelId,
          key: api_key,
        },
      });
      const result = response.data.items;
      const channelImage = result[0].snippet.thumbnails.default.url;
      return channelImage;
    } catch (error) {
      console.log("Error fetching picture:", error);
    }
  };

  
  const fetchViewCount = async (videoId) => {
    try {
      const response = await Axios.get(`${baseURL}/videos`, {
        params: {
          part: 'statistics',
          id: videoId,
          key: api_key,
        }
      })
      const statistics = response.data.items[0].statistics;
      if (statistics && statistics.viewCount) {
        return statistics.viewCount;
      } else {
        return 0;
      }
    } catch (error) {
      console.log('Error fetching views:', error);
    }
  }

  const fetchSubscriberCount = async (channelId) => {
    try {
      const response = await Axios.get(`${baseURL}/channels`, {
        params: {
          part: 'statistics',
          id: channelId,
          key: api_key,
        }
      })
      const statistics = response.data.items[0].statistics;
      return statistics.subscriberCount;
    } catch (error) {
      console.log('Error fetching subscribers:', error);
    }
  }

  const calculateTimeAgo = (uploadTime) => {
    const now = new Date();
    const uploadDate = new Date(uploadTime);
    const timeDiff = now - uploadDate;

    const secondsDiff = Math.floor(timeDiff / 1000);
    const minutesDiff = Math.floor(secondsDiff / 60);
    const hoursDiff = Math.floor(minutesDiff / 60);
    const daysDiff = Math.floor(hoursDiff / 24);
    const monthsDiff = Math.floor(daysDiff / 30);
    const yearsDiff = Math.floor(monthsDiff / 12);

    if (yearsDiff > 0) {
      return `${yearsDiff} year${ yearsDiff !== 1 ? "s" : ""} ago`;
    } else if (monthsDiff > 0) {
      return `${monthsDiff} month${ monthsDiff !== 1 ? "s" : ""} ago`;
    } else if (daysDiff > 0) {
      return `${daysDiff} day${daysDiff !== 1 ? "s" : ""} ago`;
    } else if (hoursDiff > 0) {
      return `${hoursDiff} hour${hoursDiff !== 1 ? "s" : ""} ago`;
    } else if (minutesDiff > 0) {
      return `${minutesDiff} minute${minutesDiff !== 1 ? "s" : ""} ago`;
    } else {
      return `${secondsDiff} second${secondsDiff !== 1 ? "s" : ""} ago`;
    }
  };

  const convertValue = (value) => {
    if (value === 0) {
      return 0;
    } else if (value >= 1000000) {
      return `${Math.floor(value/1000000)}M`;
    } else if (value < 1000000 && value >= 1000) {
      return `${Math.floor(value/1000)}K`;
    } else if (value < 1000) {
      return value;
    }
  }

  const DecodeHTML = (htmlContent) => {
    const decodedContent = he.decode(htmlContent);
    return decodedContent;
  }

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home videoData={videoData} convertValue={convertValue} />} />
        <Route path="/playvideo/:videoId/:title/:name/:view/:channelPicture/:ago/:description/:subscribers/:categoryId/:likeCount/:commentCount" element={<VideoPlayerPage fetchViewCount={fetchViewCount} fetchChannelPicture={fetchChannelPicture} calculateTimeAgo={calculateTimeAgo} DecodeHTML={DecodeHTML} convertValue={convertValue} api={api_key} />}/>
      </Routes>
    <div>
    </div>
    </Router>
  );
}

export default App;
