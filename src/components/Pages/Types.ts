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
}

export interface FailResult {
  code: number;
  message: string;
}

export type Result = SearchSuccessResult | VideoSuccessResult | FailResult;

export interface ServerResponse {
  success: boolean;
  result: Result;
}
