import { Video } from './VideoList';

export interface Quality {
  formatCode: string;
  extension: string;
  resolution: string;
  note: string;
}

export default interface VideoInfo extends Video {
  tags: string[];
  qualities: Quality[] | null;
}
