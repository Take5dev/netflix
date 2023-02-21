import videoTestData from '../data/videos.json';
import { getMyListVideos, getWatchedVideos } from './db/hasura';

const fetchVideos = async (URL) => {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
    const BASE_URL = 'https://youtube.googleapis.com/youtube/v3';

    const response = await fetch(
        `${BASE_URL}/${URL}&maxResults=25&key=${YOUTUBE_API_KEY}`
    );

    const data = await response.json();
    return data;
};

const getCommonVideos = async (URL) => {
    try {
        const isDev = process.env.DEVELOPMENT;
        const data = isDev ? videoTestData : await fetchVideos(URL);

        if (data?.error) {
            console.error("YouTube API Error", data.error);
            return [];
        }

        return data?.items.map(item => {
            const id = item?.id?.videoId || item.id;
            const snippet = item.snippet;
            return {
                id,
                title: snippet.title,
                imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
                description: snippet.description,
                publishedAt: snippet.publishedAt,
                channelTitle: snippet.channelTitle,
                statistics: item.statistics ? item.statistics : { viewCount: 0 }
            }
        });
    }
    catch (err) {
        console.error("Something wrong with YouTube API request", err);
        return [];
    }
};

export const getVideos = (searchQuery) => {
    const URL = `search?part=snippet&type=video&q=${encodeURI(searchQuery)}`;
    return getCommonVideos(URL);
};

export const getPopularVideos = () => {
    const URL = "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=BY";
    return getCommonVideos(URL);
};

export const getYoutubeVideoByID = (id) => {
    const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${id}`;
    return getCommonVideos(URL);
};

export const getWatchItAgainVideos = async (userId, token) => {
    const videos = await getWatchedVideos(userId, token);
    return videos?.map(video => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    });
};

export const getUserListVideos = async (userId, token) => {
    const videos = await getMyListVideos(userId, token);
    return videos?.map(video => {
        return {
            id: video.videoId,
            imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`
        }
    });
};