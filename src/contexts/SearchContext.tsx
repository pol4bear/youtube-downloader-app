import React, { useReducer } from 'react';
import { AxiosError } from 'axios';
import {
  FailResult,
  SearchItem,
  SearchSuccessResult,
  ServerResponse,
} from '../types/ResponseTypes';
import requestData from '../utils/requestData';
import Dictionary from '../types/Dictionary';
import config from '../common/Config';

const START = 'START' as const;
const LOADED = 'LOADED' as const;
const STOP = 'STOP' as const;

export const start = () => ({ type: START });
export const loaded = (response: ServerResponse) => ({
  type: LOADED,
  response,
});
export const stop = (error: number) => ({ type: STOP, error });
type SearchAction =
  | ReturnType<typeof start>
  | ReturnType<typeof loaded>
  | ReturnType<typeof stop>;

interface SearchState {
  loading: boolean;
  more: boolean;
  error: number;
  data: SearchItem[];
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
      const result = action.response.result as SearchSuccessResult;
      const newData: SearchItem[] = result.items ? result.items : [];
      const token =
        result.nextPageToken !== undefined ? result.nextPageToken : null;
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

    requestData<ServerResponse>(`search${config.serverSuffix}`, params)
      .then((response) => {
        dispatch(loaded(response.data));
      })
      .catch((e: AxiosError<ServerResponse>) => {
        let error = -1;
        if (e.response) {
          if (e.response.data.success) {
            const result = e.response.data.result as FailResult;
            error = result.code;
          }
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
