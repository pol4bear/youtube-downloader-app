import React, { useReducer } from 'react';
import { AxiosError } from 'axios';
import { Video, VideoList, ServerResponse } from '../types';
import requestData from '../utils/requestData';
import Dictionary from '../types/Dictionary';
import config from '../common/config';

const START = 'START' as const;
const LOADED = 'LOADED' as const;
const STOP = 'STOP' as const;

const start = () => ({ type: START });
const loaded = (response: ServerResponse<VideoList>) => ({
  type: LOADED,
  response,
});
const stop = (error: number) => ({ type: STOP, error });
type SearchAction =
  | ReturnType<typeof start>
  | ReturnType<typeof loaded>
  | ReturnType<typeof stop>;

interface SearchState {
  loading: boolean;
  more: boolean;
  error: number;
  data: Video[];
  token: string | null;
  setQuery: ((query: string | null) => void) | undefined;
  load: (() => void) | undefined;
}
const initialState: SearchState = {
  loading: false,
  more: true,
  error: 0,
  data: [],
  token: null,
  setQuery: undefined,
  load: undefined,
};

function searchReducer(state: SearchState, action: SearchAction): SearchState {
  switch (action.type) {
    case START:
      return { ...state, loading: true };
    case LOADED: {
      const videoList = action.response.data;
      if (!videoList) return { ...state };
      const newData: Video[] = videoList.items ? videoList.items : [];
      const token =
        videoList.nextPageToken !== undefined ? videoList.nextPageToken : null;
      return {
        ...state,
        loading: false,
        data: [...state.data, ...newData],
        token,
        more: token !== null,
      };
    }
    case STOP:
      return { ...state, loading: false, error: action.error };
    default:
      throw new Error('Unknown action');
  }
}

const SearchContext = React.createContext<SearchState>(initialState);

interface SearchProviderProps {
  children?: React.ReactNode;
}
export const SearchProvider = (props: SearchProviderProps) => {
  const [searchState, dispatch] = useReducer(searchReducer, initialState);
  const { children } = props;
  let q: string | null = null;

  const setQuery = (query: string | null) => {
    q = query;
  };
  searchState.setQuery = setQuery;

  const load = () => {
    if (!q) return;

    dispatch(start());

    const params: Dictionary<string> = {
      q: q || '',
    };
    if (searchState.token !== null) params.token = searchState.token;

    requestData<ServerResponse<VideoList>>(
      `search${config.serverSuffix}`,
      params
    )
      .then((response) => {
        dispatch(loaded(response.data));
      })
      .catch((e: AxiosError<ServerResponse<VideoList>>) => {
        let error = -1;
        if (e.response) {
          const errorInfo = e.response.data.error;
          error = errorInfo ? errorInfo.code : error;
        }
        dispatch(stop(error));
      });
  };
  searchState.load = load;

  return (
    <SearchContext.Provider value={searchState}>
      {children}
    </SearchContext.Provider>
  );
};

export default SearchContext;
