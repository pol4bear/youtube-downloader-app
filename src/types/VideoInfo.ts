import { SearchItem } from './VideoList';

export interface Quality {
  formatCode: string;
  extension: string;
  resolution: string;
  note: string;
}

export default interface VideoInfo extends SearchItem {
  tags: string[];
  qualities: Quality[] | null;
}
