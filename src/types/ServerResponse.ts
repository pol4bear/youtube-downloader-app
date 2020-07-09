import { ServerErrorInfo, VideoInfo, VideoList } from './index';

export default interface ServerResponse<T extends VideoList | VideoInfo> {
  success: boolean;
  error?: ServerErrorInfo;
  data?: T;
}
