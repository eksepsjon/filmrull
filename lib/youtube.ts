import { Video } from '@/models';
import * as duration from 'duration-fns';

export const getYoutubeId = (url: string | undefined): string | null => {
  if (!url) {
    return null;
  }
  if (url.includes('youtube') && url.includes('v=')) {
    return url.split('v=')[1].split('&')[0].split('%')[0];
  }
  return null;
};

export const fetchWithYoutubeApi = async (
  apiKey: string | undefined,
  path: string,
  queryParams: [string, string][],
): Promise<string> => {
  if (!apiKey) {
    throw new Error('YOUTUBE_API_KEY is not set');
  }

  const qp = [...queryParams, ['key', apiKey]].map((p) => p.join('=')).join('&');
  const url = `https://www.googleapis.com/youtube/v3/${path}?${qp}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  const json = await response.json();
  return JSON.stringify(json);
};

export const convertYoutubeToVideo = (youtube: any): Video => {
  console.log('snippet', youtube.items);

  const item = youtube.items[0];
  const snippet = item.snippet;
  const contentDetails = item.contentDetails;

  return {
    id: item.id,
    title: snippet.title,
    description: snippet.description,
    publishedAt: snippet.publishedAt,
    duration: duration.toSeconds(contentDetails.duration),
    thumbnail: snippet.thumbnails.default.url,
    source: 'youtube',
  };
};
