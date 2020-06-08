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
  statistics: Statistics;
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
}

export interface SearchFailResult {
  code: number;
  message: string;
  nextPageToken?: undefined;
  prevPageToken?: undefined;
  pageInfo?: {
    resultsPerPage?: undefined;
    totalResults?: undefined;
  };
  items?: undefined;
}

export type SearchResult = SearchSuccessResult | SearchFailResult;

export interface SearchResponse {
  success: boolean;
  result: SearchResult;
}
