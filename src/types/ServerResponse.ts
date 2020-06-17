import {Salt, User, VideoInfo, VideoList} from './index';

export interface FailResult {
  code: number;
  message: string;
}

export type ResponseResult = VideoList | VideoInfo | User | Salt | FailResult;

export default interface ServerResponse {
  success: boolean;
  result: ResponseResult;
}
