import { Statistics, ThumbnailInfo } from './index';

export interface SearchItem {
  id: string;
  channelId: string;
  channelTitle: string;
  description: string;
  publishedAt: string;
  title: string;
  thumbnails: {
    default: ThumbnailInfo;
    medium: ThumbnailInfo;
    high: ThumbnailInfo;
  };
  statistics?: Statistics;
}

export default interface VideoList {
  nextPageToken: string | null;
  prevPageToken: string | null;
  pageInfo: {
    resultsPerPage: number;
    totalResults: number;
  };
  items: [SearchItem];
}
