import { VideoInfo, VideoList } from './index';

export interface FailResult {
  code: number;
  message: string;
}

export type ResponseResult = VideoList | VideoInfo | FailResult;

export default interface ServerResponse {
  success: boolean;
  result: ResponseResult;
}
