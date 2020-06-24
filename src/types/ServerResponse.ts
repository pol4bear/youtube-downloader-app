import {MessageResult, Salt, SendResult, User, VideoInfo, VideoList} from './index';

export interface FailResult {
  code: number;
  message: string;
}

export type ResponseResult = VideoList | VideoInfo | User | Salt | FailResult | MessageResult | SendResult;

export default interface ServerResponse {
  success: boolean;
  result: ResponseResult;
}
