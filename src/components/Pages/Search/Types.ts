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

export interface SearchResult {
  success: boolean;
  result: {
    nextPageToken: string | null;
    prevPageToken: string | null;
    pageInfo: {
      resultsPerPage: number;
      totalResults: number;
    };
    items: [SearchItem];
  };
}
