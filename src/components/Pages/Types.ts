export interface ThumbnailInfo {
  height: number;
  url: string;
  width: number;
}

export interface Statistics {
  commentCount: number;
  dislikeCount: number;
  favoriteCount: number;
  likeCount: number;
  viewCount: number;
}

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

export interface SearchSuccessResult {
  nextPageToken: string | null;
  prevPageToken: string | null;
  pageInfo: {
    resultsPerPage: number;
    totalResults: number;
  };
  items: [SearchItem];

  code?: undefined;
  message?: undefined;
  id?: undefined;
  channelId?: undefined;
  channelTitle?: undefined;
  description?: undefined;
  publishedAt?: undefined;
  title?: undefined;
  thumbnails: {
    default?: undefined;
    medium?: undefined;
    high?: undefined;
  };
  statistics?: undefined;
  tags?: undefined;
  qualities?: undefined;
}

export interface Quality {
  formatCode: string;
  extension: string;
  resolution: string;
  note: string;
}

export interface VideoSuccessResult extends SearchItem {
  tags: string[];
  qualities: Quality[];

  nextPageToken?: undefined;
  prevPageToken?: undefined;
  pageInfo: {
    resultsPerPage?: undefined;
    totalResults?: undefined;
  };
  items: undefined;
  code?: undefined;
  message?: undefined;
}

export interface FailResult {
  code: number;
  message: string;

  nextPageToken?: undefined;
  prevPageToken?: undefined;
  pageInfo?: {
    resultsPerPage?: undefined;
    totalResults?: undefined;
  };
  id?: undefined;
  channelId?: undefined;
  channelTitle?: undefined;
  description?: undefined;
  publishedAt?: undefined;
  title?: undefined;
  thumbnails: {
    default?: undefined;
    medium?: undefined;
    high?: undefined;
  };
  statistics?: undefined;
  tags?: undefined;
  qualities?: undefined;
  items?: undefined;
}

export type Result = SearchSuccessResult | VideoSuccessResult | FailResult;

export interface SearchResponse {
  success: boolean;
  result: Result;
}
